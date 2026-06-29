param(
    [string]$BuildToolsVersion = "",
    [string]$PlatformVersion = ""
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Resolve-RequiredPath {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "$Label not found: $Path"
    }
    return (Resolve-Path -LiteralPath $Path).Path
}

function Invoke-Tool {
    param(
        [string]$FilePath,
        [string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$FilePath failed with exit code $LASTEXITCODE"
    }
}

$apkRoot = $PSScriptRoot
$projectRoot = Split-Path -Parent $apkRoot

$sdkRoot = $env:ANDROID_SDK_ROOT
if (-not $sdkRoot) { $sdkRoot = $env:ANDROID_HOME }
if (-not $sdkRoot) { $sdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$sdkRoot = Resolve-RequiredPath $sdkRoot "Android SDK"

$buildToolsRoot = Resolve-RequiredPath (Join-Path $sdkRoot "build-tools") "Android build-tools"
if (-not $BuildToolsVersion) {
    $BuildToolsVersion = (Get-ChildItem -LiteralPath $buildToolsRoot -Directory |
        Sort-Object { [version]$_.Name } -Descending |
        Select-Object -First 1).Name
}
$buildTools = Resolve-RequiredPath (Join-Path $buildToolsRoot $BuildToolsVersion) "Android build-tools $BuildToolsVersion"

$platformsRoot = Resolve-RequiredPath (Join-Path $sdkRoot "platforms") "Android platforms"
if (-not $PlatformVersion) {
    $PlatformVersion = (Get-ChildItem -LiteralPath $platformsRoot -Directory |
        Sort-Object { [int]($_.Name -replace "^android-", "") } -Descending |
        Select-Object -First 1).Name
}
$androidJar = Resolve-RequiredPath (Join-Path $platformsRoot "$PlatformVersion\android.jar") "$PlatformVersion android.jar"

$aapt2 = Resolve-RequiredPath (Join-Path $buildTools "aapt2.exe") "aapt2"
$d8 = Resolve-RequiredPath (Join-Path $buildTools "d8.bat") "d8"
$zipalign = Resolve-RequiredPath (Join-Path $buildTools "zipalign.exe") "zipalign"
$apksigner = Resolve-RequiredPath (Join-Path $buildTools "apksigner.bat") "apksigner"
$javac = (Get-Command javac -ErrorAction Stop).Source

$debugKeystore = Resolve-RequiredPath (Join-Path $env:USERPROFILE ".android\debug.keystore") "debug keystore"

$stageBase = Join-Path ([System.IO.Path]::GetTempPath()) ("kebiao-apk-build-" + [guid]::NewGuid().ToString("N"))
$stageApkRoot = Join-Path $stageBase "apk-build"
New-Item -ItemType Directory -Force -Path $stageApkRoot | Out-Null

Copy-Item -LiteralPath (Resolve-RequiredPath (Join-Path $apkRoot "AndroidManifest.xml") "AndroidManifest.xml") -Destination $stageApkRoot -Force
foreach ($dirName in @("res", "assets", "src")) {
    Copy-Item -LiteralPath (Resolve-RequiredPath (Join-Path $apkRoot $dirName) $dirName) -Destination $stageApkRoot -Recurse -Force
}

$manifest = Join-Path $stageApkRoot "AndroidManifest.xml"
$resDir = Join-Path $stageApkRoot "res"
$assetsDir = Join-Path $stageApkRoot "assets"
$srcDir = Join-Path $stageApkRoot "src"
$outDir = Join-Path $stageBase "out"

$genDir = Join-Path $outDir "gen"
$classesDir = Join-Path $outDir "classes"
$dexDir = Join-Path $outDir "dex"
New-Item -ItemType Directory -Force -Path $genDir, $classesDir, $dexDir | Out-Null

$compiledRes = Join-Path $outDir "compiled-res.zip"
$unsignedNoDex = Join-Path $outDir "unsigned-nodex.apk"
$unsignedApk = Join-Path $outDir "unsigned.apk"
$alignedApk = Join-Path $outDir "aligned.apk"
$signedApk = Join-Path $outDir "signed.apk"

$distDir = Join-Path $projectRoot "dist"
$distApk = Join-Path $distDir "kebiao.apk"
$distIdsig = "$distApk.idsig"
New-Item -ItemType Directory -Force -Path $distDir | Out-Null

Write-Host "Compiling Android resources..."
Invoke-Tool $aapt2 @("compile", "--dir", $resDir, "-o", $compiledRes)

Write-Host "Linking APK resources and assets..."
Invoke-Tool $aapt2 @(
    "link",
    "-I", $androidJar,
    "--manifest", $manifest,
    "-A", $assetsDir,
    "--java", $genDir,
    "--min-sdk-version", "23",
    "--target-sdk-version", "35",
    "--auto-add-overlay",
    "-o", $unsignedNoDex,
    $compiledRes
)

Write-Host "Compiling Java sources..."
$javaSources = @(Get-ChildItem -LiteralPath $srcDir, $genDir -Recurse -Filter "*.java" | ForEach-Object { $_.FullName })
if ($javaSources.Count -eq 0) {
    throw "No Java sources found."
}
$javacArgs = @("-encoding", "UTF-8", "-source", "8", "-target", "8", "-Xlint:-options", "-classpath", $androidJar, "-d", $classesDir) + $javaSources
Invoke-Tool $javac $javacArgs

Write-Host "Building dex bytecode..."
$classFiles = @(Get-ChildItem -LiteralPath $classesDir -Recurse -Filter "*.class" | ForEach-Object { $_.FullName })
if ($classFiles.Count -eq 0) {
    throw "No compiled class files found."
}
$d8Args = @("--lib", $androidJar, "--min-api", "23", "--output", $dexDir) + $classFiles
Invoke-Tool $d8 $d8Args

Write-Host "Adding dex to APK..."
Copy-Item -LiteralPath $unsignedNoDex -Destination $unsignedApk -Force
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($unsignedApk, [System.IO.Compression.ZipArchiveMode]::Update)
try {
    $existingDex = $zip.GetEntry("classes.dex")
    if ($existingDex) { $existingDex.Delete() }
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
        $zip,
        (Join-Path $dexDir "classes.dex"),
        "classes.dex",
        [System.IO.Compression.CompressionLevel]::Optimal
    ) | Out-Null
} finally {
    $zip.Dispose()
}

Write-Host "Aligning APK..."
Invoke-Tool $zipalign @("-f", "-p", "4", $unsignedApk, $alignedApk)

Write-Host "Signing APK with debug keystore..."
Invoke-Tool $apksigner @(
    "sign",
    "--ks", $debugKeystore,
    "--ks-key-alias", "androiddebugkey",
    "--ks-pass", "pass:android",
    "--key-pass", "pass:android",
    "--v4-signing-enabled", "true",
    "--out", $signedApk,
    $alignedApk
)

Copy-Item -LiteralPath $signedApk -Destination $distApk -Force
if (Test-Path -LiteralPath "$signedApk.idsig") {
    Copy-Item -LiteralPath "$signedApk.idsig" -Destination $distIdsig -Force
}

$mirrorParent = Join-Path $apkRoot "out"
$mirrorDir = Join-Path $mirrorParent "local-build"
$mirrorParentFull = [System.IO.Path]::GetFullPath($mirrorParent)
$mirrorDirFull = [System.IO.Path]::GetFullPath($mirrorDir)
if (-not $mirrorDirFull.StartsWith($mirrorParentFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to clean unexpected output path: $mirrorDirFull"
}
if (Test-Path -LiteralPath $mirrorDirFull) {
    Remove-Item -LiteralPath $mirrorDirFull -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $mirrorDirFull | Out-Null
Copy-Item -Path (Join-Path $outDir "*") -Destination $mirrorDirFull -Recurse -Force
Set-Content -LiteralPath (Join-Path $apkRoot "build-path.txt") -Value $stageApkRoot -Encoding ASCII

Write-Host "Verifying APK signature..."
Invoke-Tool $apksigner @("verify", "--verbose", "--print-certs", $distApk)

Write-Host "Built $distApk"
Write-Host "Intermediate build path: $stageApkRoot"

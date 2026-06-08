# 课程表

一个面向手机使用的课程表应用。项目主体是静态网页，使用原生 HTML/CSS/JavaScript 实现课表渲染、编辑、本地保存和 JSON 导入导出；Android 版本用一个轻量 WebView 包装网页，并额外加入原生桌面小组件。

默认课表数据来自本仓库的 `schedule.json`：

```text
https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json
```

应用启动后会自动读取远程课表，并与本地修改合并。用户在应用里编辑、删除、导入或清空课程后，数据会保存到浏览器或 APK 的本地存储里。

## 在线与下载

- 仓库：[tanxue0118/kebiao](https://github.com/tanxue0118/kebiao)
- 最新 APK Release：[v1.0.15](https://github.com/tanxue0118/kebiao/releases/tag/v1.0.15)
- APK 文件：[kebiao.apk](https://github.com/tanxue0118/kebiao/releases/download/v1.0.15/kebiao.apk)

## 这是怎么做的

项目分成两层：

- Web 层：`index.html`、`styles.css`、`overrides.css`、`app.js`
- Android 层：`apk-build/` 下的 Manifest、资源、Java 代码和 WebView 壳

Web 层负责主要功能：

- 从 GitHub 读取 `schedule.json`
- 根据开学日期计算当前周次
- 渲染今日课程、周课表、编辑页和设置页
- 支持课程增删改、本地缓存、JSON 导入导出
- 支持背景图、显示字段、格子高度、圆角、间距、透明度等个性化设置

Android 层负责：

- 用 `MainActivity` 加载 `file:///android_asset/www/index.html`
- 将 Web 文件打包进 `apk-build/assets/www/`
- 提供桌面小组件
- 使用 `targetSdkVersion=35`，避免“旧版 Android 应用”提示

小组件是原生 Android `AppWidgetProvider`，不依赖网页 JS：

- `CompactTodayWidgetProvider`：小号今日课程
- `TodayWidgetProvider`：中号今日课程
- `LargeTodayWidgetProvider`：大号今日课程
- `WeekWidgetProvider`：本周剩余课程

小组件会直接读取 APK 内置的 `assets/www/schedule.json`，计算当前周次和当天课程。本周小组件会隐藏已经过去的天和已经上完的课。

## 功能

- 今日课程：显示今天要上的课，已上完课程会划线。
- 周课表：按星期和节次展示课程，手机端适配五天/周末显示。
- 本地编辑：远程读取 GitHub 课表后，仍可在本地新增、编辑和删除课程。
- JSON 导入导出：支持清空课表、导入 JSON、导出当前课表 JSON。
- 自定义课程时间：每一节课的起止时间都可以在设置里修改。
- 学期设置：支持开学日期、本学期周数、假期时间段。
- 显示内容设置：课程块显示哪些字段由用户决定。
- 个性化设置：格子高度、圆角、间距、课程透明度、卡片透明度、背景图。
- Android APK：可直接安装使用。
- Android 桌面小组件：今日课程小/中/大组件，以及本周剩余课表组件。

## 文件说明

```text
.
├─ index.html                 # 页面结构
├─ styles.css                 # 基础样式
├─ overrides.css              # 后期 UI 覆盖与移动端优化
├─ app.js                     # 课表逻辑、渲染、本地保存、导入导出
├─ schedule.json              # 默认正式课表数据
├─ schedule.example.json      # 示例课表数据
├─ apk-build/                 # Android APK 手工构建目录
│  ├─ AndroidManifest.xml
│  ├─ assets/www/             # 打包进 APK 的网页文件
│  ├─ res/                    # Android 资源、小组件布局与图标
│  └─ src/com/tanxue/kebiao/  # MainActivity 与小组件 Provider
└─ dist/
   ├─ kebiao.apk
   └─ 课程表.apk
```

## 课表 JSON 格式

根对象包含三个主要字段：

```json
{
  "courses": [],
  "timeSlots": [],
  "config": {
    "semesterStartDate": "2026-03-02",
    "semesterTotalWeeks": 16
  }
}
```

### config

```json
{
  "semesterStartDate": "2026-03-02",
  "semesterTotalWeeks": 16
}
```

- `semesterStartDate`：开学日期，格式为 `YYYY-MM-DD`。应用会用它计算当前是第几周。
- `semesterTotalWeeks`：本学期周数。

也兼容根字段：

- `semesterStart`
- `semesterWeeks`

### timeSlots

`timeSlots` 定义每节课的默认起止时间。

```json
[
  {
    "number": 1,
    "startTime": "08:00",
    "endTime": "08:45"
  },
  {
    "number": 2,
    "startTime": "08:55",
    "endTime": "09:40"
  }
]
```

字段说明：

- `number`：节次编号。
- `startTime`：开始时间，格式为 `HH:mm`。
- `endTime`：结束时间，格式为 `HH:mm`。

应用设置页里的“课程时间”会修改这里的数据。导出的 JSON 也会包含修改后的 `timeSlots`。

### courses

课程对象示例：

```json
{
  "id": "linear-algebra",
  "name": "线性代数",
  "teacher": "路老师",
  "position": "厚德楼 A305",
  "day": 1,
  "startSection": 5,
  "endSection": 6,
  "weeks": [1, 2, 3, 4, 5, 6, 7, 8],
  "color": 1
}
```

字段说明：

- `id`：课程唯一 ID。建议填写；不填时应用会按课程内容自动生成。
- `name`：课程名。
- `teacher`：老师。
- `position`：地点。也兼容 `location` 或 `room`。
- `day`：星期几，`1` 到 `7` 分别表示周一到周日。也兼容 `dayOfWeek` 或 `weekday`。
- `startSection`：开始节次。
- `endSection`：结束节次。
- `weeks`：上课周次，支持数组和字符串。
- `color`：课程颜色索引，可选。
- `startTime` / `endTime`：单门课自定义时间，可选。
- `customStartTime` / `customEndTime`：单门课自定义时间，可选，优先级高于默认节次时间。

`weeks` 支持以下写法：

```json
{ "weeks": [1, 2, 3, 4, 5] }
```

```json
{ "weeks": "1-16" }
```

```json
{ "weeks": "1-8,10,12-16" }
```

临时课或考试可以这样写：

```json
{
  "id": "exam-c",
  "name": "C 语言考试",
  "teacher": "",
  "position": "4-102",
  "day": 1,
  "weeks": [17],
  "isCustomTime": true,
  "customStartTime": "15:00",
  "customEndTime": "17:00"
}
```

如果课程没有 `startSection` / `endSection`，但有 `customStartTime` / `customEndTime`，应用仍能在今日概览和小组件里显示时间。

## 本地保存规则

- 首次打开会加载内置或远程的 `schedule.json`。
- 本地新增、编辑、删除课程会保存到本地缓存。
- 再次自动读取 GitHub 课表时，会与本地课程合并。
- 删除过的课程 ID 会记录下来，避免远程同步后又被合并回来。
- 导入 JSON 会把导入内容作为新的本地课表，并清除删除记录。
- 导出 JSON 会导出当前本地课表，包括自定义节次时间。

## Android 小组件

APK 内提供四种桌面小组件：

- 今日课程小号：适合 2x2，只突出课程名和上课节次。
- 今日课程中号：显示更多今日课程。
- 今日课程大号：显示更多今日课程与地点。
- 本周课表：显示本周剩余课程，已经过去的天和已经上完的课会隐藏。

小组件数据读取的是 APK 内置 `assets/www/schedule.json`。如果用户在 WebView 里本地修改课程，小组件不会实时读取 WebView 的 localStorage；它主要用于显示 APK 内置课表。

## 构建与发布

当前仓库保留了 `dist/kebiao.apk` 和 `dist/课程表.apk`，并通过 GitHub Release 发布 APK。

发布流程：

1. 修改 Web 或 Android 资源。
2. 同步 Web 文件到 `apk-build/assets/www/`。
3. 重新构建并签名 APK。
4. 更新 `apk-build/AndroidManifest.xml` 的 `versionCode` 和 `versionName`。
5. 提交代码并推送标签，例如 `v1.0.15`。
6. GitHub Actions 会创建 Release 并上传 APK。

Release workflow 位于：

```text
.github/workflows/release.yml
```

## 注意

- `styles.css` 历史样式较多，后期 UI 优化主要集中在 `overrides.css`。
- APK 中 WebView 的入口必须保持为 `file:///android_asset/www/index.html`。
- 打包 APK 时，`assets/www/index.html` 等资源路径必须使用正斜杠 `/`，否则 WebView 可能出现“网页无法打开”。

# 课程表

一个轻量、可本地编辑、支持 Android 小组件的课程表应用。项目主体是静态 Web 页面，Android 版使用原生 WebView 打包，并额外提供桌面小组件。

默认远程课表来源：

```text
https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json
```

未清空课表时，应用启动会自动读取 GitHub 上的 `schedule.json`，并和本地修改合并。一键清空课表后，会停止自动读取远程课表，避免课程又被同步回来；重新导入 JSON 或手动新增课程后会恢复自动读取能力。

## 功能

- 今日课程：显示今天要上的课，已经上完的课程会划线。
- 周课表：按星期和节次展示课程，手机端适配一屏查看。
- 本地编辑：点击课程编辑，点击课表空白格新增课程。
- 周次切换：移动端和电脑端都可左右滑动/拖拽切换周次，也可点击顶部周次直接选择。
- 课程表单：星期、周次、节次、单双周均为应用内选择面板，不依赖系统下拉 UI。
- 自定义时间：默认使用节次时间；开启“自定义时间”后，可为单门课程设置独立开始/结束时间。
- JSON 导入导出：支持一键清空、导入 JSON、导出当前课表。
- 个性化：支持背景图、显示字段、格子高度、圆角、间距、课程透明度、卡片透明度等设置。
- Android 小组件：提供今日课程小/中/大号组件，以及本周剩余课程组件。
- 小组件同步：WebView 内编辑、导入、清空课表后，会通过 Android 桥接同步给桌面小组件并主动刷新。

## 为什么 APK 可以这么轻量

这个 APK 没有使用 React Native、Flutter、Electron、Tauri 这类大型运行时，也没有把一整个前端工程和依赖树塞进安装包。它的核心结构很简单：

- Web 页面只有 `index.html`、`styles.css`、`overrides.css`、`app.js` 和课表 JSON。
- Android 侧只保留一个 `MainActivity`，用系统自带 WebView 加载 `file:///android_asset/www/index.html`。
- 桌面小组件使用原生 `AppWidgetProvider` 和 XML 布局，不依赖网页运行。
- 不打包图片资源库、字体包、构建框架产物或第三方 UI 库。
- 课程数据是 JSON，本地缓存用浏览器 `localStorage` 和 Android `SharedPreferences`，不需要数据库。

因此 APK 主要由少量静态 Web 文件、Android 资源、Java 类和签名信息组成，体积可以保持在很小的范围内。功能复杂度放在轻量的业务逻辑里，而不是放在沉重的运行时里。

## 项目结构

```text
.
├── index.html                 # 页面结构
├── styles.css                 # 基础样式
├── overrides.css              # 后期 UI 覆盖、移动端和交互优化
├── app.js                     # 课表逻辑、渲染、本地保存、导入导出
├── schedule.json              # 默认正式课表数据
├── schedule.example.json      # 示例课表数据
├── 编写规则.md                # 给 AI 或人工编写课表 JSON 的规则
├── apk-build/
│   ├── AndroidManifest.xml
│   ├── assets/www/            # 打包进 APK 的 Web 文件
│   ├── res/                   # Android 资源、小组件布局与图标
│   └── src/com/tanxue/kebiao/ # MainActivity、桥接和小组件 Provider
└── dist/
    ├── kebiao.apk
    └── 课程表.apk
```

## JSON 格式

根对象建议包含：

```json
{
  "semesterStart": "2026-03-02",
  "semesterWeeks": 16,
  "timeSlots": [],
  "courses": []
}
```

也兼容：

```json
{
  "config": {
    "semesterStartDate": "2026-03-02",
    "semesterTotalWeeks": 16
  },
  "timeSlots": [],
  "courses": []
}
```

### timeSlots

`timeSlots` 定义每节课的默认时间：

```json
[
  { "number": 1, "startTime": "08:00", "endTime": "08:45" },
  { "number": 2, "startTime": "08:55", "endTime": "09:40" }
]
```

字段说明：

- `number`：节次编号。
- `startTime`：开始时间，格式 `HH:mm`。
- `endTime`：结束时间，格式 `HH:mm`。

### courses

课程对象示例：

```json
{
  "id": "linear-algebra",
  "name": "线性代数",
  "teacher": "路老师",
  "location": "厚德楼 A305",
  "dayOfWeek": 1,
  "weeks": "1-16",
  "weekParity": "all",
  "startSection": 5,
  "endSection": 6
}
```

字段说明：

- `id`：课程唯一 ID。建议填写英文、拼音或 UUID；不填时应用会自动生成。
- `name`：课程名。
- `teacher`：老师。
- `location`：地点。也兼容 `position`、`room`。
- `dayOfWeek`：星期几，`1` 到 `7` 分别表示周一到周日。也兼容 `day`、`weekday`。
- `weeks`：上课周次，支持 `"1-16"`、`"1-8,10,12-16"` 或 `[1,2,3]`。
- `weekParity`：单双周，`all` 表示每周，`odd` 表示单周，`even` 表示双周。
- `startSection`：开始节次。
- `endSection`：结束节次。
- `customTimeEnabled`：是否启用该课程的自定义时间，可选。
- `startTime` / `endTime`：该课程自定义时间，可选；不开启自定义时间时会使用节次默认时间。

临时考试示例：

```json
{
  "id": "exam-c-language",
  "name": "C 语言考试",
  "teacher": "",
  "location": "4-102",
  "dayOfWeek": 1,
  "weeks": "17",
  "weekParity": "all",
  "customTimeEnabled": true,
  "startTime": "15:00",
  "endTime": "17:00"
}
```

## 本地保存和远程读取

- 第一次打开时会加载内置或远程 `schedule.json`。
- 本地新增、编辑、删除课程会保存到浏览器本地缓存。
- Android 版会把当前课表同步到 `SharedPreferences`，供小组件读取。
- 自动读取 GitHub 课表时，会和本地课程合并。
- 删除过的课程 ID 会记录下来，避免远程同步后又恢复。
- 一键清空课表后，会停止自动读取远程课表。
- 导入 JSON 或手动新增课程后，会恢复自动读取远程课表。

## Android 小组件

APK 提供四种桌面小组件：

- 今日课程小号：适合 2x2，只显示课程和节次。
- 今日课程中号：显示更多今日课程信息。
- 今日课程大号：显示更多课程、时间和地点。
- 本周课表：显示本周剩余课程，已过去的天和已上完的课会隐藏。

小组件读取顺序：

1. 优先读取应用通过 `ScheduleBridge` 写入的 Android 本地缓存。
2. 如果没有缓存，则读取 APK 内置的 `assets/www/schedule.json`。

这意味着在 Android 应用里新增、编辑、导入或清空课程后，小组件会主动刷新。Android 系统仍可能对小组件定时刷新做节流，所以这里的“实时”主要指应用内事件触发刷新。

## 构建与发布

WebView 入口必须保持：

```text
file:///android_asset/www/index.html
```

APK 打包时，Web 资源必须位于：

```text
assets/www/index.html
assets/www/app.js
assets/www/overrides.css
assets/www/schedule.json
```

如果资源路径打成 `www/index.html` 而不是 `assets/www/index.html`，Android WebView 可能会显示“网页无法打开”。

发布流程：

1. 修改 Web 或 Android 代码。
2. 同步 Web 文件到 `apk-build/assets/www/`。
3. 重新构建并签名 `dist/kebiao.apk` 和 `dist/课程表.apk`。
4. 更新版本号并提交。
5. 推送到 GitHub；如需 Release，推送 `v*` 标签触发 GitHub Actions。

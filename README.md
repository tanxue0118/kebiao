# 课程表

一个静态网页课程表应用，也可以打包成 Android APK。默认会自动读取本仓库的 `schedule.json`：

```text
https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json
```

应用读取远程课表后会合并本地修改；用户在应用内新增、编辑、删除、清空、导入 JSON 后，数据会保存在浏览器或 APK 的本地缓存里。

## 功能

- 今日课程：显示当天要上的课。
- 周课表：按星期和节次展示课程，支持 5 天或显示周末。
- 本地编辑：课程读取自 GitHub 后，仍然可以在应用里自行修改。
- 课表备份：支持一键清空课表、导入 JSON、导出 JSON。
- 学期设置：可设置开学日期、本学期周数、假期时间段。
- 个性化：可调整课程格子高度、圆角、间距、课程透明度、卡片透明度、背景图。
- 课程时间：可在设置页自定义每一节课的起止时间。

## 文件说明

- `index.html`：页面结构。
- `styles.css`：界面样式。
- `app.js`：课表逻辑、本地缓存、GitHub JSON 自动读取。
- `schedule.json`：默认正式课表数据。
- `schedule.example.json`：课表示例数据。
- `dist/课程表.apk`：本地构建出的 Android APK，不建议直接提交到仓库，建议放到 GitHub Release。

## JSON 格式

根对象支持 3 个主要字段：

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

- `semesterStartDate`：开学日期，格式为 `YYYY-MM-DD`。应用会按这个日期计算当前周。
- `semesterTotalWeeks`：本学期周数。

也兼容根字段：

- `semesterStart`
- `semesterWeeks`

### timeSlots

`timeSlots` 用来定义每一节课的默认起止时间。

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

- `number`：节次编号。
- `startTime`：开始时间，格式为 `HH:mm`。
- `endTime`：结束时间，格式为 `HH:mm`。

应用内“设置 - 课程时间”可以直接编辑这些时间，导出的 JSON 也会包含修改后的 `timeSlots`。

### courses

每个课程对象示例：

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
- `day`：星期几，`1` 到 `7` 分别表示周一到周日。也兼容 `dayOfWeek`、`weekday`。
- `startSection`：开始节次。
- `endSection`：结束节次。
- `weeks`：上课周次，可以是数组，也可以是字符串。
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

如果某门课是考试或临时课程，可以写成：

```json
{
  "id": "exam-c",
  "name": "C 语言考试",
  "teacher": "",
  "position": "4-102",
  "day": 1,
  "weeks": [17],
  "startSection": 9,
  "endSection": 10,
  "customStartTime": "15:00",
  "customEndTime": "17:00"
}
```

## 本地缓存规则

- 首次打开会读取 `schedule.json`。
- 本地新增或编辑的课程会保存到本地缓存。
- 删除或清空课程后，应用会记录已删除课程 ID，避免下次自动读取 GitHub 时又把它们合并回来。
- 使用“导入 JSON”会把导入内容作为新的本地课表，并清除已删除记录。
- 使用“导出 JSON”会导出当前本地课表，包括自定义节次时间。


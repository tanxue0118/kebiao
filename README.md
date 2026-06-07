# 课程表

这是一个可放在 GitHub 仓库中供网页或 APK 读取的课程表项目。默认仓库为 `tanxue0118/kebiao`，正式数据文件是 `schedule.json`，示例文件是 `schedule.example.json`。

JSON 使用当前格式：

- `courses`：课程列表，包含 `name`、`teacher`、`position`、`day`、`startSection`、`endSection`、`weeks`。
- `timeSlots`：每一节课的开始和结束时间。
- `config.semesterStartDate`：学期第一周开始日期，用于自动跳到当前周。

## 替换 GitHub URL

1. 将自己的课程表 JSON 上传到 GitHub 仓库，例如 `schedule.json`。
2. 打开文件页面，点击 `Raw`，复制浏览器地址栏中的 raw URL。
3. 应用设置页默认使用这个 raw URL：

```text
https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json
```

如果仓库是私有的，普通网页或 APK 不能直接匿名读取 raw URL，建议使用公开仓库或改用带鉴权的接口。

## 打包 APK 方向

这是 HTML5 项目，可以继续保持网页方式开发，再用 Capacitor、Cordova 或 Android WebView 壳打包成 APK。打包时需要把 `index.html`、`app.js`、`styles.css` 等静态文件放进 WebView，并允许应用访问网络，以便读取 GitHub raw JSON。

## 缓存与编辑逻辑预期

应用启动时优先读取本地缓存；设置页可手动请求 GitHub raw URL。请求成功后会把课程表 JSON 合并并缓存在本地，例如 `localStorage`、IndexedDB 或 APK 内的本地存储。网络失败时继续读取上一次缓存，保证离线也能看课表。

用户在应用内编辑 GitHub 读取来的课程后，会保存到本地缓存并立即刷新界面。再次读取 GitHub 时，应用会以远程课表为底稿，但同一课程的本地修改优先；本地新增课程会保留，本地删除过的课程也不会被下一次同步自动加回。

## 页面与个性化

主页面是周课表网格，按节次和星期显示课程。设置页可以调整是否显示周末、开学日期、本学期周数、假期周次、课程块显示字段，以及格子高度、圆角、间距和透明度。所有个性化配置保存在本地，不会修改 GitHub 上的 `schedule.json`。

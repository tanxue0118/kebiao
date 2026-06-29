# 课程表

一款轻量课程表应用，适合自己、同学或宿舍共用。

[![Release](https://img.shields.io/github/v/release/tanxue0118/kebiao?display_name=tag)](https://github.com/tanxue0118/kebiao/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-2ea44f)](./LICENSE)

## 预览

<p align="center">
  <img src="./picture/课表预览.jpg" alt="课表预览" width="96%" />
</p>

<p align="center">
  <img src="./picture/小组件预览.jpg" alt="小组件预览" width="48%" />
</p>

## 核心功能

- 多课表管理：新建、切换、复制、重命名、删除。
- 课程编辑：课程名、老师、地点、星期、节次、周次、单双周、自定义时间。
- 课程搜索：按课程名、老师、地点快速定位课程。
- 主题切换：浅色、深色、跟随系统。
- 导入导出：JSON、ICS、PNG、颜文字分享码、二维码显示和扫码导入。
- 桌面小组件：今日课表、周课表。
- 本地优先：数据保存在本机缓存，清空只影响当前设备。

## 如何使用

1. 打开应用，默认就是空课表。
2. 在“数据管理”里导入 JSON / ICS，或者直接手动新增课程。
3. 需要多份课表时，到“课表管理”里新建或切换。
4. 需要分享时，可以导出图片、ICS、分享码，或者直接显示二维码。

## 数据格式

```json
{
  "semesterStart": "2026-03-02",
  "semesterWeeks": 16,
  "timeSlots": [
    { "number": 1, "startTime": "08:00", "endTime": "08:45" },
    { "number": 2, "startTime": "08:55", "endTime": "09:40" }
  ],
  "courses": [
    {
      "name": "高等数学",
      "teacher": "张老师",
      "location": "A305",
      "dayOfWeek": 1,
      "weeks": "1-16",
      "weekParity": "all",
      "startSection": 1,
      "endSection": 2
    }
  ]
}
```

`dayOfWeek` 取 `1-7`，`weekParity` 取 `all`、`odd`、`even`。
如果你用的是自定义时间，导入数据里也可以保留 `startTime` / `endTime`。


## 项目结构

- `index.html`、`app.js`、`styles.css`：Web 端主界面
- `apk-build/assets/www/`：APK 里使用的静态资源
- `apk-build/src/`：Android WebView 容器和小组件
- `apk-build/build-apk.ps1`：本地打包脚本
- `tests/`：静态回归测试

## Star 趋势

<a href="https://www.star-history.com/?repos=tanxue0118%2Fkebiao&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=tanxue0118/kebiao&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=tanxue0118/kebiao&type=date&legend=top-left" />
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=tanxue0118/kebiao&type=date&legend=top-left" />
  </picture>
</a>

## 许可证

MIT

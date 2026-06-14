const STORAGE_KEY = 'roommate-schedule:v1';
const BG_KEY = 'roommate-schedule:bg';
const DELETED_KEY = 'roommate-schedule:deleted';
const SETTINGS_KEY = 'roommate-schedule:settings:v1';
const DAILY_POEM_KEY = 'roommate-schedule:daily-poem:v1';
const REMOTE_DISABLED_KEY = 'roommate-schedule:remote-disabled';
const DEFAULT_REMOTE_URL = 'https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json';
const DAILY_POEM_URL = 'https://v1.jinrishici.com/all.json';
const HOLIDAY_API_URL = 'https://timor.tech/api/holiday/year/';
const FIXED_BLUR_AMOUNT = 28;

const DAY_NAMES = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const SHORT_DAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
const DAILY_POEMS = [
  '春风得意马蹄疾，一日看尽长安花。',
  '会当凌绝顶，一览众山小。',
  '海日生残夜，江春入旧年。',
  '长风破浪会有时，直挂云帆济沧海。',
  '纸上得来终觉浅，绝知此事要躬行。',
  '少年辛苦终身事，莫向光阴惰寸功。',
  '路漫漫其修远兮，吾将上下而求索。',
  '欲穷千里目，更上一层楼。',
  '博观而约取，厚积而薄发。',
  '及时当勉励，岁月不待人。',
  '不经一番寒彻骨，怎得梅花扑鼻香。',
  '千磨万击还坚劲，任尔东西南北风。',
  '读书不觉已春深，一寸光阴一寸金。',
  '问渠那得清如许，为有源头活水来。',
  '盛年不重来，一日难再晨。',
  '黑发不知勤学早，白首方悔读书迟。',
  '三更灯火五更鸡，正是男儿读书时。',
  '大鹏一日同风起，扶摇直上九万里。',
  '苔花如米小，也学牡丹开。',
  '莫愁前路无知己，天下谁人不识君。',
  '山重水复疑无路，柳暗花明又一村。',
  '沉舟侧畔千帆过，病树前头万木春。',
  '天生我材必有用，千金散尽还复来。',
  '千淘万漉虽辛苦，吹尽狂沙始到金。',
  '粗缯大布裹生涯，腹有诗书气自华。',
  '江山代有才人出，各领风骚数百年。',
  '欲买桂花同载酒，终不似，少年游。',
  '且将新火试新茶，诗酒趁年华。',
  '清水出芙蓉，天然去雕饰。',
  '少年易老学难成，一寸光阴不可轻。',
  '立志欲坚不欲锐，成功在久不在速。',
  '功名多向穷中立，祸患常从巧处生。',
  '看似寻常最奇崛，成如容易却艰辛。',
  '纸屏石枕竹方床，手倦抛书午梦长。',
  '一蓑烟雨任平生。',
  '行到水穷处，坐看云起时。',
  '星垂平野阔，月涌大江流。',
  '潮平两岸阔，风正一帆悬。',
  '疏影横斜水清浅，暗香浮动月黄昏。',
  '等闲识得东风面，万紫千红总是春。',
  '小荷才露尖尖角，早有蜻蜓立上头。',
  '晴空一鹤排云上，便引诗情到碧霄。',
  '溪云初起日沉阁，山雨欲来风满楼。',
  '落红不是无情物，化作春泥更护花。',
  '采得百花成蜜后，为谁辛苦为谁甜。'
];
const DEFAULT_TIME_SLOTS = [
  { number: 1, startTime: '08:00', endTime: '08:45' },
  { number: 2, startTime: '08:55', endTime: '09:40' },
  { number: 3, startTime: '10:00', endTime: '10:45' },
  { number: 4, startTime: '10:55', endTime: '11:40' },
  { number: 5, startTime: '14:30', endTime: '15:15' },
  { number: 6, startTime: '15:25', endTime: '16:10' },
  { number: 7, startTime: '16:20', endTime: '17:05' },
  { number: 8, startTime: '17:15', endTime: '18:00' },
  { number: 9, startTime: '18:40', endTime: '19:25' },
  { number: 10, startTime: '19:35', endTime: '20:20' },
  { number: 11, startTime: '20:30', endTime: '21:15' },
  { number: 12, startTime: '21:25', endTime: '22:10' }
];

const DEFAULT_SETTINGS = {
  languageMode: 'zh-CN',
  showWeekend: false,
  semesterStart: '',
  semesterWeeks: 16,
  holidayRanges: '',
  autoHolidayRanges: '',
  holidaySourceYear: '',
  holidaySourceName: '',
  holidaySourceUpdatedAt: '',
  visibleFields: ['name', 'teacher', 'location', 'time', 'weeks'],
  cellHeight: 72,
  cellRadius: 8,
  cellGap: 6,
  courseOpacity: 0.92,
  cardOpacity: 0.42
};

const LANGUAGE_MODES = ['zh-CN', 'zh-TW', 'en'];
const I18N = {
  'zh-CN': {
    appTitle: '课程表', today: '今天', todayTab: '今日', scheduleTab: '课表', editTab: '编辑', settingsTab: '设置',
    todayOverview: '今日概览', todayPlaceholder: '今日课程将由脚本填充。', weekSchedule: '本周课表', weekView: '周视图',
    localSave: '本地保存', newCourse: '新课程', editCourse: '编辑课程', courseName: '课程名', teacher: '老师', location: '地点',
    dayOfWeek: '星期', weeks: '上课周次', parity: '单双周', everyWeek: '每周', oddWeek: '单周', evenWeek: '双周',
    startSection: '开始节', endSection: '结束节', customTime: '自定义时间', customStart: '自定义开始时间', customEnd: '自定义结束时间',
    save: '保存', delete: '删除', settingsTitle: '课表设置', basicSettings: '基础设置', basicDesc: '学期、周次、节次时间',
    viewSettings: '外观设置', viewDesc: '语言、显示内容、个性化、背景', dataManagement: '数据管理', dataDesc: '清空、导入、导出课表',
    backSettings: '‹ 返回设置', semester: '学期', weeksAndHolidays: '周次与假期', semesterStartDate: '开学日期', semesterTotalWeeks: '本学期周数',
    language: '语言', multiLanguage: '多语言', displayContent: '显示内容', courseInfo: '课表信息', weekendCourses: '周末课程', visibleFields: '显示字段',
    fieldName: '课程名', fieldTeacher: '老师', fieldLocation: '地点', fieldTime: '时间', fieldSections: '节次', fieldWeeks: '周次',
    personalization: '个性化', courseBlockStyle: '课程块样式', cellHeight: '格子高度', radius: '圆角', gap: '间距', opacity: '透明度', cardOpacity: '卡片透明度',
    courseTime: '课程时间', sectionTime: '节次时间', eachSectionTime: '每节时间', addTimeSlot: '+ 添加节次', saveTime: '保存时间', background: '背景',
    pageImage: '页面图片', changeBackground: '更换背景', scheduleBackup: '课表备份', clearSchedule: '清空课表', importJson: '导入 JSON', exportJson: '导出 JSON',
    weekLabel: '第 {week} 周', weekUnit: '周', dayCountHoliday: '本周 {count} 天节假日', holidayNow: '节假日中', courseCount: '{count} 门课', noCoursesThisWeek: '本周无课',
    sectionHeader: '节次', addCourseTitle: '点击新增课程', holidayHint: '第 {week} 周包含节假日。', holidayEmptyWeek: '这一周没有课程。',
    emptyWeek: '这一周没有课程。', todaySummaryHoliday: '{date} · 第 {week} 周 · 节假日', todaySummary: '{date} · 第 {week} 周 · {summary}',
    noCourseTodayShort: '今天没课', noCourseToday: '今天没有安排课程。', holidayToday: '今天是节假日，好好休息。', sectionRange: '第 {start}-{end} 节', rest: '休',
    fullSemester: '全学期（1-{total} 周）', currentWeek: '当前第 {week} 周', firstHalf: '前半学期（1-{half} 周）', secondHalf: '后半学期（{start}-{total} 周）',
    sectionOption: '第 {number} 节{time}', chooseDay: '选择星期', chooseWeeks: '选择上课周次', chooseParity: '选择单双周', chooseStartSection: '选择开始节', chooseEndSection: '选择结束节',
    scheduleLoadedAuto: '已自动读取课表，并合并本地修改', scheduleLoaded: '已读取课表，并保留本地修改', scheduleLoadFailed: '读取失败，继续使用本地缓存：{message}',
    remoteLoadFallback: '远程读取失败，已使用本地缓存或内置数据', customTimeRequired: '请填写自定义开始和结束时间', endTimeAfterStart: '结束时间需要晚于开始时间',
    endSectionAfterStart: '结束节不能早于开始节', savedLocal: '已保存到本地缓存', courseDeleted: '已删除', scheduleCleared: '课表已清空',
    jsonImported: 'JSON 课表已导入', importFailed: '导入失败：{message}', importReadFailed: '导入失败：无法读取文件', jsonExported: 'JSON 课表已导出',
    timesSaved: '课程时间已保存', timeFormatError: '时间格式错误：{message}', backToCurrentWeek: '已回到本周课表', backgroundSaved: '背景已保存到本地',
    confirmClear: '确定清空当前课表吗？', holidaySourceNetwork: '联网数据', holidaySourceBuiltIn: '内置数据'
  },
  'zh-TW': {
    appTitle: '課程表', today: '今天', todayTab: '今日', scheduleTab: '課表', editTab: '編輯', settingsTab: '設定',
    todayOverview: '今日概覽', todayPlaceholder: '今日課程將由程式填充。', weekSchedule: '本週課表', weekView: '週視圖',
    localSave: '本機儲存', newCourse: '新課程', editCourse: '編輯課程', courseName: '課程名', teacher: '老師', location: '地點',
    dayOfWeek: '星期', weeks: '上課週次', parity: '單雙週', everyWeek: '每週', oddWeek: '單週', evenWeek: '雙週',
    startSection: '開始節', endSection: '結束節', customTime: '自訂時間', customStart: '自訂開始時間', customEnd: '自訂結束時間',
    save: '儲存', delete: '刪除', settingsTitle: '課表設定', basicSettings: '基礎設定', basicDesc: '學期、週次、節次時間',
    viewSettings: '外觀設定', viewDesc: '語言、顯示內容、個人化、背景', dataManagement: '資料管理', dataDesc: '清空、匯入、匯出課表',
    backSettings: '‹ 返回設定', semester: '學期', weeksAndHolidays: '週次與假期', semesterStartDate: '開學日期', semesterTotalWeeks: '本學期週數',
    language: '語言', multiLanguage: '多語言', displayContent: '顯示內容', courseInfo: '課表資訊', weekendCourses: '週末課程', visibleFields: '顯示欄位',
    fieldName: '課程名', fieldTeacher: '老師', fieldLocation: '地點', fieldTime: '時間', fieldSections: '節次', fieldWeeks: '週次',
    personalization: '個人化', courseBlockStyle: '課程塊樣式', cellHeight: '格子高度', radius: '圓角', gap: '間距', opacity: '透明度', cardOpacity: '卡片透明度',
    courseTime: '課程時間', sectionTime: '節次時間', eachSectionTime: '每節時間', addTimeSlot: '+ 新增節次', saveTime: '儲存時間', background: '背景',
    pageImage: '頁面圖片', changeBackground: '更換背景', scheduleBackup: '課表備份', clearSchedule: '清空課表', importJson: '匯入 JSON', exportJson: '匯出 JSON',
    weekLabel: '第 {week} 週', weekUnit: '週', dayCountHoliday: '本週 {count} 天節假日', holidayNow: '節假日中', courseCount: '{count} 門課', noCoursesThisWeek: '本週無課',
    sectionHeader: '節次', addCourseTitle: '點擊新增課程', holidayHint: '第 {week} 週包含節假日。', holidayEmptyWeek: '這一週沒有課程。',
    emptyWeek: '這一週沒有課程。', todaySummaryHoliday: '{date} · 第 {week} 週 · 節假日', todaySummary: '{date} · 第 {week} 週 · {summary}',
    noCourseTodayShort: '今天沒課', noCourseToday: '今天沒有安排課程。', holidayToday: '今天是節假日，好好休息。', sectionRange: '第 {start}-{end} 節', rest: '休',
    fullSemester: '全學期（1-{total} 週）', currentWeek: '目前第 {week} 週', firstHalf: '前半學期（1-{half} 週）', secondHalf: '後半學期（{start}-{total} 週）',
    sectionOption: '第 {number} 節{time}', chooseDay: '選擇星期', chooseWeeks: '選擇上課週次', chooseParity: '選擇單雙週', chooseStartSection: '選擇開始節', chooseEndSection: '選擇結束節',
    scheduleLoadedAuto: '已自動讀取課表，並合併本機修改', scheduleLoaded: '已讀取課表，並保留本機修改', scheduleLoadFailed: '讀取失敗，繼續使用本機快取：{message}',
    remoteLoadFallback: '遠端讀取失敗，已使用本機快取或內建資料', customTimeRequired: '請填寫自訂開始和結束時間', endTimeAfterStart: '結束時間需要晚於開始時間',
    endSectionAfterStart: '結束節不能早於開始節', savedLocal: '已儲存到本機快取', courseDeleted: '已刪除', scheduleCleared: '課表已清空',
    jsonImported: 'JSON 課表已匯入', importFailed: '匯入失敗：{message}', importReadFailed: '匯入失敗：無法讀取檔案', jsonExported: 'JSON 課表已匯出',
    timesSaved: '課程時間已儲存', timeFormatError: '時間格式錯誤：{message}', backToCurrentWeek: '已回到本週課表', backgroundSaved: '背景已儲存到本機',
    confirmClear: '確定清空目前課表嗎？', holidaySourceNetwork: '聯網資料', holidaySourceBuiltIn: '內建資料'
  },
  en: {
    appTitle: 'Schedule', today: 'Today', todayTab: 'Today', scheduleTab: 'Schedule', editTab: 'Edit', settingsTab: 'Settings',
    todayOverview: 'Today', todayPlaceholder: 'Today courses will appear here.', weekSchedule: 'Weekly Schedule', weekView: 'Week view',
    localSave: 'Local Save', newCourse: 'New Course', editCourse: 'Edit Course', courseName: 'Course', teacher: 'Teacher', location: 'Location',
    dayOfWeek: 'Day', weeks: 'Weeks', parity: 'Odd/Even', everyWeek: 'Every week', oddWeek: 'Odd weeks', evenWeek: 'Even weeks',
    startSection: 'Start', endSection: 'End', customTime: 'Custom time', customStart: 'Custom start', customEnd: 'Custom end',
    save: 'Save', delete: 'Delete', settingsTitle: 'Schedule Settings', basicSettings: 'Basic', basicDesc: 'Semester, weeks, section times',
    viewSettings: 'Appearance', viewDesc: 'Language, display, style, background', dataManagement: 'Data', dataDesc: 'Clear, import, export schedule',
    backSettings: '‹ Settings', semester: 'Semester', weeksAndHolidays: 'Weeks and Holidays', semesterStartDate: 'Start Date', semesterTotalWeeks: 'Total Weeks',
    language: 'Language', multiLanguage: 'Language', displayContent: 'Display', courseInfo: 'Course Info', weekendCourses: 'Weekend courses', visibleFields: 'Visible fields',
    fieldName: 'Course', fieldTeacher: 'Teacher', fieldLocation: 'Location', fieldTime: 'Time', fieldSections: 'Sections', fieldWeeks: 'Weeks',
    personalization: 'Style', courseBlockStyle: 'Course Cards', cellHeight: 'Cell height', radius: 'Radius', gap: 'Gap', opacity: 'Opacity', cardOpacity: 'Card opacity',
    courseTime: 'Times', sectionTime: 'Section Times', eachSectionTime: 'Section time', addTimeSlot: '+ Add section', saveTime: 'Save times', background: 'Background',
    pageImage: 'Page Image', changeBackground: 'Change background', scheduleBackup: 'Schedule Backup', clearSchedule: 'Clear schedule', importJson: 'Import JSON', exportJson: 'Export JSON',
    weekLabel: 'Week {week}', weekUnit: 'weeks', dayCountHoliday: '{count} holiday days this week', holidayNow: 'Holiday', courseCount: '{count} courses', noCoursesThisWeek: 'No courses this week',
    sectionHeader: 'Sec.', addCourseTitle: 'Add course', holidayHint: 'Week {week} includes holidays.', holidayEmptyWeek: 'No courses this week.',
    emptyWeek: 'No courses this week.', todaySummaryHoliday: '{date} · Week {week} · Holiday', todaySummary: '{date} · Week {week} · {summary}',
    noCourseTodayShort: 'No courses today', noCourseToday: 'No courses today.', holidayToday: 'Today is a holiday. Rest well.', sectionRange: 'Sections {start}-{end}', rest: 'Off',
    fullSemester: 'Full semester (weeks 1-{total})', currentWeek: 'Current week {week}', firstHalf: 'First half (weeks 1-{half})', secondHalf: 'Second half (weeks {start}-{total})',
    sectionOption: 'Section {number}{time}', chooseDay: 'Choose day', chooseWeeks: 'Choose weeks', chooseParity: 'Choose odd/even', chooseStartSection: 'Choose start', chooseEndSection: 'Choose end',
    scheduleLoadedAuto: 'Schedule loaded automatically and merged with local changes', scheduleLoaded: 'Schedule loaded and local changes kept', scheduleLoadFailed: 'Load failed, using local cache: {message}',
    remoteLoadFallback: 'Remote load failed, using local cache or bundled data', customTimeRequired: 'Enter custom start and end times', endTimeAfterStart: 'End time must be after start time',
    endSectionAfterStart: 'End section cannot be before start section', savedLocal: 'Saved to local cache', courseDeleted: 'Deleted', scheduleCleared: 'Schedule cleared',
    jsonImported: 'JSON schedule imported', importFailed: 'Import failed: {message}', importReadFailed: 'Import failed: could not read file', jsonExported: 'JSON schedule exported',
    timesSaved: 'Course times saved', timeFormatError: 'Time format error: {message}', backToCurrentWeek: 'Back to current week', backgroundSaved: 'Background saved locally',
    confirmClear: 'Clear the current schedule?', holidaySourceNetwork: 'Online data', holidaySourceBuiltIn: 'Bundled data'
  }
};

const DAY_NAMES_BY_LANGUAGE = {
  'zh-CN': ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  'zh-TW': ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

const SHORT_DAY_NAMES_BY_LANGUAGE = {
  'zh-CN': ['一', '二', '三', '四', '五', '六', '日'],
  'zh-TW': ['一', '二', '三', '四', '五', '六', '日'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
};

const fallbackSchedule = {
  semesterStart: '2026-03-02',
  semesterWeeks: 16,
  timeSlots: DEFAULT_TIME_SLOTS,
  config: {
    semesterStartDate: '2026-03-02',
    semesterTotalWeeks: 16
  },
  courses: [
    {
      id: 'demo-math',
      name: '高等数学',
      teacher: '王老师',
      location: '教学楼 A101',
      dayOfWeek: 1,
      weeks: '1-16',
      startSection: 1,
      endSection: 2
    },
    {
      id: 'demo-english',
      name: '大学英语',
      teacher: '李老师',
      location: '综合楼 305',
      dayOfWeek: 3,
      weeks: '1-12',
      startSection: 5,
      endSection: 6
    }
  ]
};

const FALLBACK_CHINA_HOLIDAYS = {
  2026: [
    '2026-01-01..2026-01-03',
    '2026-02-16..2026-02-23',
    '2026-04-04..2026-04-06',
    '2026-05-01..2026-05-05',
    '2026-06-19..2026-06-21',
    '2026-09-25..2026-09-27',
    '2026-10-01..2026-10-07'
  ]
};

let state = loadSchedule();
let settings = loadSettings(state);
let activeWeek = clampMinWeek(getCurrentWeek(getSemesterStart()));
let activeDay = getTodayDay();
let pendingRenderParts = null;
let pendingRenderFrame = 0;
let settingsPersistTimer = 0;
let holidayRangeCacheKey = null;
let holidayRangeCache = [];
let suppressGridClickUntil = 0;
const weekMatchCache = new Map();

const els = {
  todayText: document.getElementById('todayText'),
  dailyPoem: document.getElementById('dailyPoem'),
  weekLabel: document.getElementById('weekLabel'),
  dateRange: document.getElementById('dateRange'),
  prevWeekBtn: document.getElementById('prevWeekBtn'),
  nextWeekBtn: document.getElementById('nextWeekBtn'),
  todayJumpBtn: document.getElementById('todayJumpBtn'),
  pageTabs: document.querySelectorAll('[data-page]'),
  bgInput: document.getElementById('bgInput'),
  clearScheduleBtn: document.getElementById('clearScheduleBtn'),
  importScheduleInput: document.getElementById('importScheduleInput'),
  exportScheduleBtn: document.getElementById('exportScheduleBtn'),
  saveTimeSlotsBtn: document.getElementById('saveTimeSlotsBtn'),
  bgLayer: document.getElementById('bgLayer'),
  todaySummary: document.getElementById('todaySummary'),
  todayCourseList: document.getElementById('todayCourseList'),
  dayTabs: document.getElementById('dayTabs'),
  activeDayText: document.getElementById('activeDayText'),
  courseCount: document.getElementById('courseCount'),
  courseList: document.getElementById('courseList'),
  addBtn: document.getElementById('addBtn'),
  form: document.getElementById('courseForm'),
  editorTitle: document.getElementById('editorTitle'),
  deleteBtn: document.getElementById('deleteBtn'),
  fields: {
    id: document.getElementById('courseId'),
    name: document.getElementById('courseName'),
    teacher: document.getElementById('teacher'),
    location: document.getElementById('location'),
    dayOfWeek: document.getElementById('dayOfWeek'),
    weeks: document.getElementById('weeks'),
    weekParity: document.getElementById('weekParity'),
    startSection: document.getElementById('startSection'),
    endSection: document.getElementById('endSection'),
    customTimeEnabled: document.getElementById('customTimeEnabled'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime')
  },
  settings: {}
};

init();

function init() {
  detectBackdropSupport();
  injectTimetableStyles();
  restoreBackground();
  ensureSettingsControls();
  bindSettingsControls();
  bindSettingsSections();
  applyAppearanceSettings();
  applyLanguage();
  renderDayTabs();
  renderWeek();
  renderTimetable();
  renderToday();
  resetForm(false);

  els.prevWeekBtn?.addEventListener('click', () => changeWeek(-1));
  els.nextWeekBtn?.addEventListener('click', () => changeWeek(1));
  els.todayJumpBtn?.addEventListener('click', jumpToToday);
  els.pageTabs.forEach((tab) => tab.addEventListener('click', () => showPage(tab.dataset.page)));
  els.bgInput?.addEventListener('change', changeBackground);
  els.clearScheduleBtn?.addEventListener('click', clearSchedule);
  els.importScheduleInput?.addEventListener('change', importScheduleJson);
  els.exportScheduleBtn?.addEventListener('click', exportScheduleJson);
  els.saveTimeSlotsBtn?.addEventListener('click', saveTimeSlots);
  els.addBtn?.addEventListener('click', () => resetForm());
  els.form?.addEventListener('submit', saveCourse);
  els.deleteBtn?.addEventListener('click', deleteCourse);
  els.fields.startSection?.addEventListener('change', syncSectionTimeDefaults);
  els.fields.endSection?.addEventListener('change', syncSectionTimeDefaults);
  els.fields.customTimeEnabled?.addEventListener('change', updateCustomTimeControls);
  document.querySelector('.week-chip')?.addEventListener('click', openWeekPicker);
  bindWeekSwipe();
  window.addEventListener('resize', debounce(renderTimetable, 160));
  window.setInterval(renderToday, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) renderToday();
  });

  syncScheduleToAndroid();
  maybeRefreshAutoHolidays();
  if (document.getElementById('todayPage')) showPage('todayPage');
  if (!isRemoteScheduleDisabled()) {
    window.setTimeout(() => loadRemoteSchedule(DEFAULT_REMOTE_URL, { auto: true }), 0);
  }
}

function detectBackdropSupport() {
  const supportsBackdrop = window.CSS?.supports?.('backdrop-filter', 'blur(1px)')
    || window.CSS?.supports?.('-webkit-backdrop-filter', 'blur(1px)');
  document.body.classList.toggle('no-backdrop', !supportsBackdrop);
}

function loadSchedule() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (cached && Array.isArray(cached.courses)) return normalizeSchedule(cached);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return normalizeSchedule(fallbackSchedule);
}

function loadSettings(schedule) {
  let stored = {};
  try {
    stored = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    localStorage.removeItem(SETTINGS_KEY);
  }
  const hasStoredStart = Object.prototype.hasOwnProperty.call(stored, 'semesterStart') && stored.semesterStart;
  const hasStoredWeeks = Object.prototype.hasOwnProperty.call(stored, 'semesterWeeks');

  const normalized = {
    ...DEFAULT_SETTINGS,
    ...stored,
    visibleFields: Array.isArray(stored.visibleFields) ? stored.visibleFields : DEFAULT_SETTINGS.visibleFields
  };
  if (!hasStoredStart) normalized.semesterStart = getScheduleStart(schedule);
  normalized.semesterWeeks = hasStoredWeeks
    ? toPositiveInt(normalized.semesterWeeks, getScheduleWeeks(schedule))
    : getScheduleWeeks(schedule);
  normalized.cellHeight = toPositiveInt(normalized.cellHeight, DEFAULT_SETTINGS.cellHeight);
  normalized.cellRadius = toPositiveInt(normalized.cellRadius, DEFAULT_SETTINGS.cellRadius);
  normalized.cellGap = toPositiveInt(normalized.cellGap, DEFAULT_SETTINGS.cellGap);
  normalized.courseOpacity = clampNumber(Number(normalized.courseOpacity), 0.2, 1, DEFAULT_SETTINGS.courseOpacity);
  normalized.cardOpacity = clampNumber(Number(normalized.cardOpacity), 0, 1, DEFAULT_SETTINGS.cardOpacity);
  normalized.languageMode = LANGUAGE_MODES.includes(normalized.languageMode) ? normalized.languageMode : DEFAULT_SETTINGS.languageMode;
  return normalized;
}

function normalizeSchedule(schedule) {
  const timeSlots = normalizeTimeSlots(schedule.timeSlots);
  const semesterStart = getScheduleStart(schedule);
  const semesterWeeks = getScheduleWeeks(schedule);

  return {
    semesterStart,
    semesterWeeks,
    timeSlots,
    config: {
      ...(schedule.config || {}),
      semesterStartDate: semesterStart,
      semesterTotalWeeks: semesterWeeks
    },
    courses: (schedule.courses || []).map((course) => normalizeCourse(course, timeSlots))
  };
}

function normalizeCourse(course, timeSlots) {
  const [timeStart, timeEnd] = String(course.time || '').split('-').map((part) => part.trim());
  const customStart = course.customStartTime || course.startTime || timeStart || '';
  const customEnd = course.customEndTime || course.endTime || timeEnd || '';
  const inferredStart = findSlotByTime(timeSlots, customStart, 'startTime') || 1;
  const inferredEnd = findSlotByTime(timeSlots, customEnd, 'endTime') || inferredStart;
  const startSection = Number(course.startSection || course.startPeriod || course.sectionStart || inferredStart);
  const endSection = Number(course.endSection || course.endPeriod || course.sectionEnd || inferredEnd || startSection);
  const startSlot = timeSlots.find((slot) => slot.number === startSection);
  const endSlot = timeSlots.find((slot) => slot.number === endSection);
  const normalized = {
    id: course.id || '',
    name: course.name || course.courseName || '未命名课程',
    teacher: course.teacher || '未填写老师',
    location: course.location || course.position || course.room || '未填写地点',
    dayOfWeek: normalizeDay(course.dayOfWeek || course.weekday || course.day || 1),
    weeks: normalizeWeeks(course.weeks || course.weekText || '1-16'),
    weekParity: normalizeWeekParity(course.weekParity || course.parity || course.repeat || 'all'),
    startSection,
    endSection,
    startTime: customStart || startSlot?.startTime || '',
    endTime: customEnd || endSlot?.endTime || ''
  };
  normalized.customTimeEnabled = Boolean(course.customTimeEnabled || course.customTime)
    || normalized.startTime !== (startSlot?.startTime || '')
    || normalized.endTime !== (endSlot?.endTime || '');
  normalized.id = normalized.id || createCourseId(normalized);
  return normalized;
}

function findSlotByTime(timeSlots, time, key) {
  if (!time) return null;
  const exact = timeSlots.find((slot) => slot[key] === time);
  if (exact) return exact.number;
  const target = timeToMinutes(time);
  if (!Number.isFinite(target)) return null;
  const scored = timeSlots
    .map((slot) => ({ slot, distance: Math.abs(timeToMinutes(slot[key]) - target) }))
    .filter((item) => Number.isFinite(item.distance))
    .sort((a, b) => a.distance - b.distance);
  return scored[0]?.slot.number || null;
}

function timeToMinutes(time) {
  const [hour, minute] = String(time).split(':').map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return NaN;
  return hour * 60 + minute;
}

function getScheduleStart(schedule) {
  return schedule.semesterStart || schedule.weekStartDate || schedule.config?.semesterStartDate || fallbackSchedule.semesterStart;
}

function getScheduleWeeks(schedule) {
  return toPositiveInt(schedule.semesterWeeks || schedule.totalWeeks || schedule.config?.semesterTotalWeeks, fallbackSchedule.semesterWeeks);
}

function normalizeTimeSlots(slots) {
  const source = Array.isArray(slots) && slots.length ? slots : DEFAULT_TIME_SLOTS;
  return source
    .map((slot, index) => ({
      number: Number(slot.number || slot.section || slot.period || index + 1),
      startTime: slot.startTime || slot.start || '',
      endTime: slot.endTime || slot.end || ''
    }))
    .filter((slot) => Number.isFinite(slot.number))
    .sort((a, b) => a.number - b.number);
}

function normalizeDay(value) {
  const day = Number(value);
  return day >= 1 && day <= 7 ? day : 1;
}

function normalizeWeeks(weeks) {
  if (Array.isArray(weeks)) return weeks.join(',');
  return String(weeks)
    .replace(/[第周]/g, '')
    .replace(/\s+/g, '');
}

function normalizeWeekParity(value) {
  const text = String(value || 'all').toLowerCase();
  if (['odd', 'single', 'dan', '单', '单周'].includes(text)) return 'odd';
  if (['even', 'double', 'shuang', '双', '双周'].includes(text)) return 'even';
  return 'all';
}

async function loadRemoteSchedule(urlOverride, options = {}) {
  if (isRemoteScheduleDisabled()) return;
  const url = (urlOverride || DEFAULT_REMOTE_URL).trim();

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = normalizeSchedule(await res.json());
    state = mergeRemoteWithLocal(remote, state);
    settings = loadSettings(state);
    activeWeek = clampMinWeek(activeWeek || getCurrentWeek(getSemesterStart()));
    persist();
    writeSettingsControls();
    writeTimeSlotsControl();
    renderDayTabs();
    renderWeek();
    renderTimetable();
    renderToday();
    resetForm(false);
    showStatus(options.auto ? t('scheduleLoadedAuto') : t('scheduleLoaded'));
  } catch (error) {
    if (!options.auto) showStatus(t('scheduleLoadFailed', { message: error.message }));
    else showStatus(t('remoteLoadFallback'));
  }
}

function mergeRemoteWithLocal(remote, local) {
  const deletedIds = getDeletedIds();
  const localCourses = new Map((local.courses || []).map((course) => [course.id, course]));
  const remoteIds = new Set();
  const mergedCourses = [];

  remote.courses.forEach((course) => {
    remoteIds.add(course.id);
    if (!deletedIds.has(course.id)) mergedCourses.push(localCourses.get(course.id) || course);
  });

  (local.courses || []).forEach((course) => {
    if (!remoteIds.has(course.id) && !deletedIds.has(course.id)) mergedCourses.push(course);
  });

  return {
    ...remote,
    courses: mergedCourses
  };
}

function saveCourse(event) {
  event.preventDefault();
  const useCustomTime = Boolean(els.fields.customTimeEnabled?.checked);
  let startSection;
  let endSection;
  let startTime;
  let endTime;

  if (useCustomTime) {
    startTime = els.fields.startTime.value;
    endTime = els.fields.endTime.value;
    if (!startTime || !endTime) {
      showStatus(t('customTimeRequired'));
      return;
    }
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      showStatus(t('endTimeAfterStart'));
      return;
    }
    startSection = findSlotByTime(state.timeSlots, startTime, 'startTime') || 1;
    endSection = findSlotByTime(state.timeSlots, endTime, 'endTime') || startSection;
    if (endSection < startSection) endSection = startSection;
  } else {
    startSection = Number(els.fields.startSection.value);
    endSection = Number(els.fields.endSection.value);
    if (endSection < startSection) {
      showStatus(t('endSectionAfterStart'));
      return;
    }
    startTime = getSlotTime(startSection, 'startTime') || els.fields.startTime.value;
    endTime = getSlotTime(endSection, 'endTime') || els.fields.endTime.value;
  }

  const course = {
    id: els.fields.id.value || createId(),
    name: els.fields.name.value.trim(),
    teacher: els.fields.teacher.value.trim(),
    location: els.fields.location.value.trim(),
    dayOfWeek: Number(els.fields.dayOfWeek.value),
    weeks: els.fields.weeks.value.trim(),
    weekParity: normalizeWeekParity(els.fields.weekParity?.value || 'all'),
    startSection,
    endSection,
    customTimeEnabled: useCustomTime,
    startTime,
    endTime
  };

  const existingIndex = state.courses.findIndex((item) => item.id === course.id);
  if (existingIndex >= 0) state.courses[existingIndex] = course;
  else state.courses.push(course);

  removeDeletedId(course.id);
  activeDay = course.dayOfWeek;
  persist();
  renderDayTabs();
  renderTimetable();
  renderToday();
  fillForm(course);
  showPage('schedulePage');
  showStatus(t('savedLocal'));
}

function getLanguageMode() {
  return LANGUAGE_MODES.includes(settings.languageMode) ? settings.languageMode : DEFAULT_SETTINGS.languageMode;
}

function getCurrentLocale() {
  return getLanguageMode() === 'en' ? 'en-US' : getLanguageMode();
}

function t(key, values = {}) {
  const text = I18N[getLanguageMode()]?.[key] || I18N[DEFAULT_SETTINGS.languageMode][key] || key;
  return Object.entries(values).reduce((result, [name, value]) => (
    result.replaceAll(`{${name}}`, String(value))
  ), text);
}

function getDayNames() {
  return DAY_NAMES_BY_LANGUAGE[getLanguageMode()] || DAY_NAMES_BY_LANGUAGE[DEFAULT_SETTINGS.languageMode];
}

function getShortDayNames() {
  return SHORT_DAY_NAMES_BY_LANGUAGE[getLanguageMode()] || SHORT_DAY_NAMES_BY_LANGUAGE[DEFAULT_SETTINGS.languageMode];
}

function applyLanguage() {
  const lang = getLanguageMode();
  document.documentElement.lang = lang;
  document.title = t('appTitle');

  const textTargets = [
    ['.hero h1', 'appTitle'],
    ['#todayText', 'today'],
    ['.app-tabs [data-page="todayPage"]', 'todayTab'],
    ['.app-tabs [data-page="schedulePage"]', 'scheduleTab'],
    ['.app-tabs [data-page="editPage"]', 'editTab'],
    ['.app-tabs [data-page="settingsPage"]', 'settingsTab'],
    ['#todayPage .section-title p', 'todayOverview'],
    ['#schedulePage .section-title p', 'weekSchedule'],
    ['#schedulePage .section-title h2', 'weekView'],
    ['#editPage .section-title p', 'localSave'],
    ['#editorTitle', 'newCourse'],
    ['#settingsPage > .panel > .section-title p', 'settingsTab'],
    ['#settingsPage > .panel > .section-title h2', 'settingsTitle'],
    ['[data-settings-section-target="basic"] strong', 'basicSettings'],
    ['[data-settings-section-target="basic"] span', 'basicDesc'],
    ['[data-settings-section-target="view"] strong', 'viewSettings'],
    ['[data-settings-section-target="view"] span', 'viewDesc'],
    ['[data-settings-section-target="data"] strong', 'dataManagement'],
    ['[data-settings-section-target="data"] span', 'dataDesc'],
    ['#addTimeSlotBtn', 'addTimeSlot'],
    ['#saveTimeSlotsBtn', 'saveTime'],
    ['#clearScheduleBtn', 'clearSchedule'],
    ['#exportScheduleBtn', 'exportJson'],
    ['.data-file-button', 'importJson']
  ];
  textTargets.forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((node) => {
      setElementText(node, t(key));
    });
  });

  const labels = [
    ['courseName', 'courseName'],
    ['teacher', 'teacher'],
    ['location', 'location'],
    ['dayOfWeek', 'dayOfWeek'],
    ['weeks', 'weeks'],
    ['weekParity', 'parity'],
    ['startSection', 'startSection'],
    ['endSection', 'endSection'],
    ['customTimeEnabled', 'customTime'],
    ['startTime', 'customStart'],
    ['endTime', 'customEnd'],
    ['semesterStartDate', 'semesterStartDate'],
    ['semesterTotalWeeks', 'semesterTotalWeeks'],
    ['showWeekend', 'weekendCourses'],
    ['cellHeight', 'cellHeight'],
    ['cellRadius', 'radius'],
    ['cellGap', 'gap'],
    ['courseOpacity', 'opacity'],
    ['cardOpacity', 'cardOpacity'],
    ['bgInput', 'changeBackground']
  ];
  labels.forEach(([id, key]) => {
    const label = document.getElementById(id)?.closest('label');
    const span = label?.querySelector('span');
    if (span) span.textContent = t(key);
  });

  const optionLabels = {
    all: 'everyWeek',
    odd: 'oddWeek',
    even: 'evenWeek'
  };
  document.querySelectorAll('#weekParity option').forEach((option) => {
    option.textContent = t(optionLabels[option.value] || 'everyWeek');
  });

  const buttons = [
    ['#todayJumpBtn', 'today'],
    ['#courseForm button.primary', 'save'],
    ['#deleteBtn', 'delete']
  ];
  buttons.forEach(([selector, key]) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = t(key);
    });
  });

  document.querySelectorAll('[data-settings-back]').forEach((node) => {
    node.textContent = t('backSettings');
  });

  const sectionTitles = [
    ['[data-settings-section="basic"] .section-title p', 'semester'],
    ['[data-settings-section="basic"] .section-title h2', 'weeksAndHolidays'],
    ['#languageModeGroup', 'language'],
    ['#languageModeGroup', 'multiLanguage'],
    ['#visibleFields', 'visibleFields'],
    ['#timeSlotList', 'eachSectionTime']
  ];
  document.querySelectorAll('[data-settings-section="view"] .section-title').forEach((title, index) => {
    const pairs = [
      ['language', 'multiLanguage'],
      ['displayContent', 'courseInfo'],
      ['personalization', 'courseBlockStyle'],
      ['background', 'pageImage']
    ][index];
    if (!pairs) return;
    title.querySelector('p').textContent = t(pairs[0]);
    title.querySelector('h2').textContent = t(pairs[1]);
  });
  document.querySelectorAll('[data-settings-section="data"] .section-title').forEach((title) => {
    title.querySelector('p').textContent = t('localSave');
    title.querySelector('h2').textContent = t('scheduleBackup');
  });
  document.querySelectorAll('[data-settings-section="basic"] .section-title').forEach((title, index) => {
    const pairs = index === 0 ? ['semester', 'weeksAndHolidays'] : ['courseTime', 'sectionTime'];
    title.querySelector('p').textContent = t(pairs[0]);
    title.querySelector('h2').textContent = t(pairs[1]);
  });
  const legend = document.querySelector('#visibleFields legend');
  if (legend) legend.textContent = t('visibleFields');
  document.querySelectorAll('#visibleFields label').forEach((label) => {
    const key = `field${label.querySelector('input')?.value?.replace(/^./, (char) => char.toUpperCase())}`;
    const value = I18N[getLanguageMode()]?.[key] ? t(key) : label.textContent.trim();
    label.lastChild.textContent = ` ${value}`;
  });

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#eef5ff');
}

function setElementText(node, text) {
  if (!node.querySelector('input')) {
    node.textContent = text;
    return;
  }
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) child.remove();
  });
  node.appendChild(document.createTextNode(text));
}

function renderWeek() {
  const start = startOfWeek(addDays(parseDate(getSemesterStart()), (activeWeek - 1) * 7));
  const end = addDays(start, 6);
  populateWeekOptions();
  if (els.todayText) {
    els.todayText.textContent = new Intl.DateTimeFormat(getCurrentLocale(), {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(new Date());
  }
  if (els.weekLabel) els.weekLabel.textContent = t('weekLabel', { week: activeWeek });
  if (els.dateRange) els.dateRange.textContent = `${formatDate(start)} - ${formatDate(end)}`;
}

async function renderDailyPoem() {
  if (!els.dailyPoem) return;
  const dateKey = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const cached = readDailyPoemCache(dateKey);
  if (cached) {
    els.dailyPoem.textContent = cached;
    return;
  }

  els.dailyPoem.textContent = getLocalDailyPoem(dateKey);
  try {
    const res = await fetch(DAILY_POEM_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const remotePoem = formatRemotePoem(data);
    if (remotePoem) {
      localStorage.setItem(DAILY_POEM_KEY, JSON.stringify({ date: dateKey, text: remotePoem }));
      els.dailyPoem.textContent = remotePoem;
    }
  } catch {
    localStorage.setItem(DAILY_POEM_KEY, JSON.stringify({ date: dateKey, text: els.dailyPoem.textContent }));
  }
}

function readDailyPoemCache(dateKey) {
  try {
    const cached = JSON.parse(localStorage.getItem(DAILY_POEM_KEY));
    return cached?.date === dateKey ? cached.text : '';
  } catch {
    localStorage.removeItem(DAILY_POEM_KEY);
    return '';
  }
}

function formatRemotePoem(data) {
  const content = String(data.content || data.hitokoto || '').trim();
  if (!content) return '';
  const author = String(data.author || data.origin?.author || '').trim();
  const title = String(data.origin || data.title || data.origin?.title || '').trim();
  const from = [author, title && `《${title}》`].filter(Boolean).join(' ');
  return from ? `${content} - ${from}` : content;
}

function getLocalDailyPoem(dateKey) {
  let hash = 0;
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return DAILY_POEMS[hash % DAILY_POEMS.length];
}

function renderDayTabs() {
  const visibleDays = getVisibleDays();
  if (els.dayTabs) {
    els.dayTabs.innerHTML = '';
    els.dayTabs.style.display = 'none';
  }

  if (els.fields.dayOfWeek) {
    els.fields.dayOfWeek.innerHTML = getDayNames().map((name, index) => (
      `<option value="${index + 1}">${name}</option>`
    )).join('');
  }
  populateCourseSelectors();

  if (!visibleDays.includes(activeDay)) activeDay = visibleDays[0];
}

function populateCourseSelectors() {
  populateWeekOptions();
  populateSectionOptions();
  enhanceCourseSelects();
}

function populateWeekOptions() {
  if (!els.fields.weeks) return;
  const current = els.fields.weeks.value;
  const total = getSemesterWeeks();
  const options = [
    { value: `1-${total}`, label: t('fullSemester', { total }) },
    { value: String(activeWeek), label: t('currentWeek', { week: activeWeek }) }
  ];
  const half = Math.floor(total / 2);
  if (half >= 1 && half < total) {
    options.push({ value: `1-${half}`, label: t('firstHalf', { half }) });
    options.push({ value: `${half + 1}-${total}`, label: t('secondHalf', { start: half + 1, total }) });
  }
  for (let week = 1; week <= total; week += 1) {
    options.push({ value: String(week), label: t('weekLabel', { week }) });
  }
  els.fields.weeks.innerHTML = options.map((option) => (
    `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`
  )).join('');
  els.fields.weeks.value = options.some((option) => option.value === current) ? current : `1-${total}`;
}

function populateSectionOptions() {
  const slots = getDisplayTimeSlots();
  const currentStart = els.fields.startSection?.value;
  const currentEnd = els.fields.endSection?.value;
  const html = slots.map((slot) => {
    const time = [slot.startTime, slot.endTime].filter(Boolean).join('-');
    const label = t('sectionOption', { number: slot.number, time: time ? ` 路 ${time}` : '' });
    return `<option value="${slot.number}">${escapeHtml(label)}</option>`;
  }).join('');
  if (els.fields.startSection) els.fields.startSection.innerHTML = html;
  if (els.fields.endSection) els.fields.endSection.innerHTML = html;
  if (els.fields.startSection && [...els.fields.startSection.options].some((option) => option.value === currentStart)) {
    els.fields.startSection.value = currentStart;
  }
  if (els.fields.endSection && [...els.fields.endSection.options].some((option) => option.value === currentEnd)) {
    els.fields.endSection.value = currentEnd;
  }
}

function enhanceCourseSelects() {
  [
    [els.fields.dayOfWeek, () => t('chooseDay')],
    [els.fields.weeks, () => t('chooseWeeks')],
    [els.fields.weekParity, () => t('chooseParity')],
    [els.fields.startSection, () => t('chooseStartSection')],
    [els.fields.endSection, () => t('chooseEndSection')]
  ].forEach(([select, title]) => enhanceSelect(select, title));
  refreshCustomSelects();
}

function enhanceSelect(select, title) {
  if (!select || select.dataset.enhanced === 'true') return;
  select.dataset.enhanced = 'true';
  select.classList.add('native-select-hidden');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'custom-select-button';
  button.dataset.selectFor = select.id;
  button.addEventListener('click', () => openSelectPicker(select, typeof title === 'function' ? title() : title));
  select.insertAdjacentElement('afterend', button);
  select.addEventListener('change', () => {
    refreshCustomSelect(select);
    if (select === els.fields.startSection || select === els.fields.endSection) syncSectionTimeDefaults();
  });
}

function refreshCustomSelects() {
  [els.fields.dayOfWeek, els.fields.weeks, els.fields.weekParity, els.fields.startSection, els.fields.endSection]
    .forEach(refreshCustomSelect);
}

function refreshCustomSelect(select) {
  if (!select) return;
  const button = document.querySelector(`[data-select-for="${select.id}"]`);
  if (!button) return;
  const selected = select.options[select.selectedIndex];
  button.textContent = selected?.textContent || t('chooseWeeks');
}

function openSelectPicker(select, title) {
  if (!select) return;
  openOptionPicker({
    title,
    options: [...select.options].map((option) => ({ value: option.value, label: option.textContent })),
    value: select.value,
    onSelect: (value) => {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

function openWeekPicker() {
  const total = Math.max(getSemesterWeeks(), activeWeek);
  const options = [];
  for (let week = 1; week <= total + 8; week += 1) {
    const label = t('weekLabel', { week });
    options.push({ value: String(week), label: week > getSemesterWeeks() ? `${label} · ${t('holidayNow')}` : label });
  }
  openOptionPicker({
    title: t('chooseWeeks'),
    options,
    value: String(activeWeek),
    onSelect: (value) => {
      activeWeek = clampMinWeek(Number(value));
      renderWeek();
      renderTimetable();
      renderToday();
      resetForm(false);
    }
  });
}

function openOptionPicker({ title, options, value, onSelect }) {
  document.querySelector('.option-picker-backdrop')?.remove();
  const backdrop = document.createElement('div');
  backdrop.className = 'option-picker-backdrop';
  const panel = document.createElement('div');
  panel.className = 'option-picker-panel';
  const heading = document.createElement('div');
  heading.className = 'option-picker-heading';
  heading.innerHTML = `<strong>${escapeHtml(title)}</strong><button type="button" aria-label="鍏抽棴">脳</button>`;
  const list = document.createElement('div');
  list.className = 'option-picker-list';
  options.forEach((option) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = option.value === value ? 'is-active' : '';
    item.textContent = option.label;
    item.addEventListener('click', () => {
      onSelect(option.value);
      backdrop.remove();
    });
    list.appendChild(item);
  });
  heading.querySelector('button').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
  panel.append(heading, list);
  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);
}

function renderTimetable() {
  const visibleDays = getVisibleDays();
  const slots = getDisplayTimeSlots();
  const weekStart = startOfWeek(addDays(parseDate(getSemesterStart()), (activeWeek - 1) * 7));
  const dateByDay = new Map(visibleDays.map((day) => [day, addDays(weekStart, day - 1)]));
  const holidayDays = new Set(visibleDays.filter((day) => isHolidayDate(dateByDay.get(day))));
  const dayColumns = new Map(visibleDays.map((day, index) => [day, index + 2]));
  const slotRows = new Map(slots.map((slot, index) => [slot.number, index + 2]));
  const courses = state.courses
    .filter((course) => visibleDays.includes(course.dayOfWeek) && includesCourseWeek(course, activeWeek))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startSection - b.startSection);
  const isHoliday = isHolidayWeek(activeWeek);
  const holidayDayCount = holidayDays.size;
  const holidayLabel = isHoliday && holidayDayCount < visibleDays.length
    ? t('dayCountHoliday', { count: holidayDayCount })
    : t('holidayNow');

  if (els.activeDayText) els.activeDayText.textContent = isHoliday ? holidayLabel : t('weekSchedule');
  if (els.courseCount) els.courseCount.textContent = isHoliday
    ? t('weekLabel', { week: activeWeek })
    : (courses.length ? t('courseCount', { count: courses.length }) : t('noCoursesThisWeek'));
  if (!els.courseList) return;

  applyAppearanceSettings();
  els.courseList.className = 'timetable';
  els.courseList.style.setProperty('--cell-height', `${settings.cellHeight}px`);
  els.courseList.style.setProperty('--cell-radius', `${settings.cellRadius}px`);
  els.courseList.style.setProperty('--cell-gap', `${settings.cellGap}px`);
  els.courseList.style.setProperty('--course-opacity', String(settings.courseOpacity));
  els.courseList.style.setProperty('--visible-day-count', String(visibleDays.length));
  els.courseList.dataset.weekends = settings.showWeekend ? 'visible' : 'hidden';
  const fragment = document.createDocumentFragment();

  const timetable = document.createElement('div');
  timetable.className = `timetable-grid${isHoliday ? ' holiday-week' : ''}`;
  timetable.classList.toggle('weekdays-only', !settings.showWeekend);
  timetable.classList.toggle('weekends-hidden', !settings.showWeekend);
  timetable.dataset.weekends = settings.showWeekend ? 'visible' : 'hidden';
  timetable.style.setProperty('--visible-day-count', String(visibleDays.length));
  timetable.style.setProperty('--day-count', String(visibleDays.length));
  timetable.style.gridTemplateColumns = `var(--time-rail-width, 78px) repeat(${visibleDays.length}, minmax(var(--day-min-width, 0px), 1fr))`;
  timetable.style.gridTemplateRows = `44px repeat(${slots.length}, minmax(${settings.cellHeight}px, auto))`;
  timetable.style.gap = `${settings.cellGap}px`;
  timetable.style.minWidth = '0';
  timetable.style.width = '100%';

  timetable.appendChild(createGridHeader(t('sectionHeader'), 1, 1));
  visibleDays.forEach((day, index) => {
    const isHolidayDay = holidayDays.has(day);
    timetable.appendChild(createGridHeader(
      getDayHeaderName(day),
      index + 2,
      1,
      formatDayHeaderDate(weekStart, day),
      { holiday: isHolidayDay, day }
    ));
  });

  slots.forEach((slot, rowIndex) => {
    const row = rowIndex + 2;
    timetable.appendChild(createTimeCell(slot, row));
    visibleDays.forEach((day, dayIndex) => {
      const cell = document.createElement('div');
      cell.className = 'timetable-cell';
      cell.style.gridColumn = String(dayIndex + 2);
      cell.style.gridRow = String(row);
      cell.style.minHeight = `${settings.cellHeight}px`;
      cell.style.borderRadius = `${settings.cellRadius}px`;
      cell.dataset.day = String(day);
      cell.dataset.section = String(slot.number);
      cell.title = t('addCourseTitle');
      cell.addEventListener('click', () => {
        if (Date.now() < suppressGridClickUntil) return;
        resetFormAt(day, slot.number);
      });
      timetable.appendChild(cell);
    });
  });

  courses.forEach((course, index) => {
    const dayColumn = dayColumns.get(course.dayOfWeek);
    const startRow = slotRows.get(course.startSection);
    const endRow = slotRows.get(course.endSection);
    if (!dayColumn || !startRow || !endRow) return;
    timetable.appendChild(createCourseBlock(course, dayColumn, startRow, endRow + 1, index, false));
  });

  fragment.appendChild(timetable);

  if (!courses.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = isHoliday ? t('holidayEmptyWeek') : t('emptyWeek');
    fragment.appendChild(empty);
  }

  const track = document.createElement('div');
  track.className = 'timetable-track';
  track.appendChild(fragment);
  els.courseList.replaceChildren(track);
}

function renderToday() {
  if (!els.todaySummary || !els.todayCourseList) return;

  const today = new Date();
  const todayDay = getTodayDay();
  const todayWeek = clampMinWeek(getCurrentWeek(getSemesterStart()));
  const isHoliday = isHolidayDate(today);
  const todayCourses = state.courses
    .filter((course) => course.dayOfWeek === todayDay && includesCourseWeek(course, todayWeek))
    .sort((a, b) => a.startSection - b.startSection || String(a.startTime).localeCompare(String(b.startTime)));
  const dayText = new Intl.DateTimeFormat(getCurrentLocale(), {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today);

  els.todaySummary.textContent = isHoliday
    ? t('todaySummaryHoliday', { date: dayText, week: todayWeek })
    : t('todaySummary', {
      date: dayText,
      week: todayWeek,
      summary: todayCourses.length ? t('courseCount', { count: todayCourses.length }) : t('noCourseTodayShort')
    });
  const fragment = document.createDocumentFragment();

  if (!todayCourses.length) {
    const empty = document.createElement('div');
    empty.className = 'empty today-empty';
    empty.textContent = isHoliday ? t('holidayToday') : t('noCourseToday');
    els.todayCourseList.replaceChildren(empty);
    return;
  }

  todayCourses.forEach((course) => {
    const card = document.createElement('article');
    card.className = `today-course${isCourseFinishedToday(course, today) ? ' is-finished' : ''}`;
    card.innerHTML = `
      <div class="today-time">${escapeHtml(course.startTime || '')}${course.endTime ? ` - ${escapeHtml(course.endTime)}` : ''}</div>
      <div class="today-main">
        <h3>${escapeHtml(course.name)}</h3>
        <p>${escapeHtml(course.teacher)} 路 ${escapeHtml(course.location)}</p>
        <span>${escapeHtml(t('sectionRange', { start: course.startSection, end: course.endSection }))}</span>
      </div>
    `;
    card.addEventListener('click', () => fillForm(course));
    fragment.appendChild(card);
  });
  els.todayCourseList.replaceChildren(fragment);
}

function isCourseFinishedToday(course, date = new Date()) {
  const end = timeToMinutes(course.endTime);
  if (!Number.isFinite(end)) return false;
  const now = date.getHours() * 60 + date.getMinutes();
  return end < now;
}

function createGridHeader(text, column, row, subtext = '', options = {}) {
  const header = document.createElement('div');
  header.className = 'timetable-header';
  header.classList.toggle('is-holiday-day', Boolean(options.holiday));
  header.style.gridColumn = String(column);
  header.style.gridRow = String(row);
  if (options.day) header.dataset.day = String(options.day);
  if (subtext) {
    const title = document.createElement('strong');
    title.textContent = text;
    const date = document.createElement('span');
    date.textContent = options.holiday ? `${subtext} ${t('rest')}` : subtext;
    header.append(title, date);
  } else {
    header.textContent = text;
  }
  return header;
}

function getDayHeaderName(day) {
  return window.matchMedia('(max-width: 640px)').matches ? getShortDayNames()[day - 1] : getDayNames()[day - 1];
}

function formatDayHeaderDate(weekStart, day) {
  const date = addDays(weekStart, day - 1);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function debounce(fn, wait = 120) {
  let timer;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
}

function createTimeCell(slot, row) {
  const cell = document.createElement('div');
  cell.className = 'time-cell';
  cell.style.gridColumn = '1';
  cell.style.gridRow = String(row);
  cell.style.minHeight = `${settings.cellHeight}px`;
  cell.style.borderRadius = `${settings.cellRadius}px`;
  const timeText = [slot.startTime, slot.endTime].filter(Boolean).join('-');
  cell.innerHTML = `<strong>${t('sectionOption', { number: slot.number, time: '' })}</strong><span>${timeText}</span>`;
  return cell;
}

function createCourseBlock(course, column, rowStart, rowEnd, index, isHoliday) {
  const span = Math.max(1, rowEnd - rowStart);
  const visualOpacity = isHoliday ? Math.min(settings.courseOpacity, 0.5) : settings.courseOpacity;
  const block = document.createElement('article');
  block.className = 'course-card timetable-course';
  block.style.gridColumn = String(column);
  block.style.gridRow = `${rowStart} / ${rowEnd}`;
  block.style.gridTemplateColumns = 'minmax(0, 1fr)';
  block.style.alignContent = 'start';
  block.style.minHeight = `${span * settings.cellHeight + (span - 1) * settings.cellGap}px`;
  block.style.borderRadius = `${settings.cellRadius}px`;
  block.style.zIndex = String(10 + index);
  block.dataset.span = String(span);
  block.style.setProperty('--course-index', String(Math.min(index, 8)));
  block.style.setProperty('--course-visual-opacity', String(visualOpacity));
  block.style.setProperty('--course-color-alpha', String(visualOpacity));
  block.style.setProperty('--course-surface-alpha', String(Math.min(visualOpacity * 0.58, 0.58)));

  if (settings.visibleFields.includes('name')) {
    const title = document.createElement('h3');
    title.textContent = course.name;
    block.appendChild(title);
  }

  const details = getCourseDetails(course);
  if (details.length) {
    const meta = document.createElement('p');
    meta.className = 'course-meta';
    details.forEach((detail) => {
      const item = document.createElement('span');
      item.textContent = detail;
      meta.appendChild(item);
    });
    block.appendChild(meta);
  }

  block.addEventListener('click', () => fillForm(course));
  block.title = t('editCourse');
  return block;
}

function getCourseDetails(course) {
  const fields = new Set(settings.visibleFields);
  const details = [];
  if (fields.has('teacher')) details.push(course.teacher);
  if (fields.has('location')) details.push(course.location);
  if (fields.has('time')) details.push(`${course.startTime || ''}-${course.endTime || ''}`.replace(/^-|-$/g, ''));
  if (fields.has('weeks')) details.push(t('weekLabel', { week: course.weeks }));
  if (fields.has('sections')) details.push(t('sectionRange', { start: course.startSection, end: course.endSection }));
  return details.filter(Boolean);
}

function getDisplayTimeSlots() {
  const maxCourseSection = Math.max(0, ...state.courses.map((course) => Number(course.endSection) || 0));
  const source = state.timeSlots?.length ? state.timeSlots : DEFAULT_TIME_SLOTS;
  const lastSlot = source[source.length - 1];
  const maxSection = Math.max(maxCourseSection, lastSlot?.number || 12);
  const byNumber = new Map(source.map((slot) => [slot.number, slot]));
  return Array.from({ length: maxSection }, (_, index) => {
    const number = index + 1;
    return byNumber.get(number) || { number, startTime: '', endTime: '' };
  });
}

function getVisibleDays() {
  return settings.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
}

function ensureSettingsControls() {
  const stack = document.querySelector('#settingsPage .settings-stack');
  if (!stack || document.getElementById('showWeekend')) return;

  const panel = document.createElement('div');
  panel.className = 'settings-stack timetable-settings';
  panel.innerHTML = `
    <div class="language-options" id="languageModeGroup" role="radiogroup" aria-label="语言">
      <label><input type="radio" name="languageMode" value="zh-CN"> 简体中文</label>
      <label><input type="radio" name="languageMode" value="zh-TW"> 繁體中文</label>
      <label><input type="radio" name="languageMode" value="en"> English</label>
    </div>
    <label class="field"><span>周末课程</span><input id="showWeekend" type="checkbox"></label>
    <div class="form-row">
      <label class="field"><span>开学日期</span><input id="semesterStart" type="date"></label>
      <label class="field"><span>总周数</span><input id="semesterWeeks" type="number" min="1" max="30"></label>
    </div>
    <fieldset class="field" id="visibleFields">
      <legend>课程块字段</legend>
      <label><input type="checkbox" value="teacher"> 老师</label>
      <label><input type="checkbox" value="location"> 地点</label>
      <label><input type="checkbox" value="time"> 时间</label>
      <label><input type="checkbox" value="weeks"> 周次</label>
      <label><input type="checkbox" value="sections"> 节次</label>
    </fieldset>
    <div class="form-row">
      <label class="field"><span>格子高度</span><input id="cellHeight" type="number" min="48" max="160"></label>
      <label class="field"><span>圆角</span><input id="cellRadius" type="number" min="0" max="28"></label>
    </div>
    <div class="form-row">
      <label class="field"><span>间距</span><input id="cellGap" type="number" min="0" max="20"></label>
      <label class="field"><span>课程透明度</span><input id="courseOpacity" type="number" min="0.2" max="1" step="0.05"></label>
      <label class="field"><span>卡片透明度</span><input id="cardOpacity" type="number" min="0" max="1" step="0.04"></label>
    </div>
  `;
  stack.appendChild(panel);
}

function bindSettingsControls() {
  els.settings = {
    languageModeGroup: getByIds('languageModeGroup'),
    showWeekend: getByIds('showWeekend', 'settingShowWeekend'),
    semesterStart: getByIds('semesterStart', 'semesterStartDate', 'settingSemesterStart'),
    semesterWeeks: getByIds('semesterWeeks', 'semesterTotalWeeks', 'settingSemesterWeeks'),
    visibleFields: getByIds('visibleFields', 'visibleCourseFields', 'settingVisibleFields'),
    cellHeight: getByIds('cellHeight', 'settingCellHeight'),
    cellRadius: getByIds('cellRadius', 'settingCellRadius'),
    cellGap: getByIds('cellGap', 'settingCellGap'),
    courseOpacity: getByIds('courseOpacity', 'settingCourseOpacity'),
    cardOpacity: getByIds('cardOpacity', 'settingCardOpacity')
  };

  writeSettingsControls();
  writeTimeSlotsControl();
  document.getElementById('addTimeSlotBtn')?.addEventListener('click', addTimeSlotRow);
  getLanguageModeInputs().forEach((input) => {
    input.addEventListener('change', readSettingsControls);
  });
  Object.values(els.settings).forEach((control) => {
    if (!control) return;
    control.addEventListener('input', readSettingsControls);
    control.addEventListener('change', readSettingsControls);
  });
}

function bindSettingsSections() {
  const tabs = [...document.querySelectorAll('[data-settings-section-target]')];
  const groups = [...document.querySelectorAll('[data-settings-section]')];
  const stack = document.querySelector('#settingsPage .settings-stack');
  const home = document.querySelector('#settingsPage .settings-home');
  const backs = [...document.querySelectorAll('[data-settings-back]')];
  if (!tabs.length || !groups.length) return;

  const activate = (target) => {
    if (home) home.hidden = true;
    if (stack) stack.hidden = false;
    tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.settingsSectionTarget === target));
    groups.forEach((group) => {
      group.hidden = group.dataset.settingsSection !== target;
    });
  };

  const backHome = () => {
    if (home) home.hidden = false;
    if (stack) stack.hidden = true;
    tabs.forEach((tab) => tab.classList.remove('active'));
    groups.forEach((group) => {
      group.hidden = true;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.settingsSectionTarget));
  });
  backs.forEach((button) => button.addEventListener('click', backHome));
  backHome();
}

function scheduleRender(parts) {
  pendingRenderParts = {
    ...(pendingRenderParts || {}),
    ...parts
  };
  if (pendingRenderFrame) return;

  const run = () => {
    const current = pendingRenderParts || {};
    pendingRenderParts = null;
    pendingRenderFrame = 0;
    if (current.dayTabs) renderDayTabs();
    if (current.week) renderWeek();
    if (current.timetable) renderTimetable();
    if (current.today) renderToday();
    if (current.form) resetForm(false);
  };

  pendingRenderFrame = window.requestAnimationFrame
    ? window.requestAnimationFrame(run)
    : window.setTimeout(run, 16);
}

function persistSettingsSoon() {
  window.clearTimeout(settingsPersistTimer);
  settingsPersistTimer = window.setTimeout(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, 180);
}

function getByIds(...ids) {
  return ids.map((id) => document.getElementById(id)).find(Boolean);
}

function writeSettingsControls() {
  getLanguageModeInputs().forEach((input) => {
    input.checked = input.value === settings.languageMode;
  });
  if (els.settings.showWeekend) els.settings.showWeekend.checked = settings.showWeekend;
  if (els.settings.semesterStart) els.settings.semesterStart.value = settings.semesterStart;
  if (els.settings.semesterWeeks) els.settings.semesterWeeks.value = settings.semesterWeeks;
  if (els.settings.cellHeight) els.settings.cellHeight.value = settings.cellHeight;
  if (els.settings.cellRadius) els.settings.cellRadius.value = settings.cellRadius;
  if (els.settings.cellGap) els.settings.cellGap.value = settings.cellGap;
  if (els.settings.courseOpacity) els.settings.courseOpacity.value = settings.courseOpacity;
  if (els.settings.cardOpacity) els.settings.cardOpacity.value = settings.cardOpacity;
  getVisibleFieldInputs().forEach((input) => {
    input.checked = settings.visibleFields.includes(input.value);
  });
}

function writeTimeSlotsControl() {
  const list = document.getElementById('timeSlotList');
  if (!list) return;
  const slots = normalizeTimeSlots(state.timeSlots);
  list.replaceChildren(...slots.map((slot, index) => createTimeSlotRow(index + 1, slot.startTime, slot.endTime)));
}

function createTimeSlotRow(number, startTime = '', endTime = '') {
  const row = document.createElement('div');
  row.className = 'picker-row time-slot-row';
  const numberEl = document.createElement('span');
  numberEl.className = 'slot-number';
  numberEl.textContent = t('sectionOption', { number, time: '' });
  const start = document.createElement('input');
  start.type = 'time';
  start.className = 'slot-start';
  start.value = startTime || '';
  const sep = document.createElement('span');
  sep.className = 'picker-sep';
  sep.textContent = '-';
  const end = document.createElement('input');
  end.type = 'time';
  end.className = 'slot-end';
  end.value = endTime || '';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'picker-remove';
  remove.setAttribute('aria-label', t('delete'));
  remove.textContent = '×';
  remove.addEventListener('click', () => {
    row.remove();
    renumberTimeSlotRows();
  });
  row.append(numberEl, start, sep, end, remove);
  return row;
}

function renumberTimeSlotRows() {
  const list = document.getElementById('timeSlotList');
  if (!list) return;
  [...list.querySelectorAll('.time-slot-row .slot-number')].forEach((el, index) => {
    el.textContent = t('sectionOption', { number: index + 1, time: '' });
  });
}

function addTimeSlotRow() {
  const list = document.getElementById('timeSlotList');
  if (!list) return;
  const count = list.querySelectorAll('.time-slot-row').length;
  list.appendChild(createTimeSlotRow(count + 1));
  renumberTimeSlotRows();
}

function saveTimeSlots() {
  const list = document.getElementById('timeSlotList');
  if (!list) return;
  try {
    const rows = [...list.querySelectorAll('.time-slot-row')];
    if (!rows.length) throw new Error('至少保留一节课时间');
    const slots = rows.map((row, index) => {
      const startTime = row.querySelector('.slot-start')?.value || '';
      const endTime = row.querySelector('.slot-end')?.value || '';
      if (!startTime || !endTime) throw new Error(`第 ${index + 1} 节请选择开始和结束时间`);
      if (timeToMinutes(endTime) <= timeToMinutes(startTime)) throw new Error(`第 ${index + 1} 节结束时间需要晚于开始时间`);
      return { number: index + 1, startTime, endTime };
    });
    state.timeSlots = normalizeTimeSlots(slots);
    state = normalizeSchedule(state);
    persist();
    writeTimeSlotsControl();
    populateSectionOptions();
    renderTimetable();
    renderToday();
    resetForm(false);
    showStatus(t('timesSaved'));
  } catch (error) {
    showStatus(t('timeFormatError', { message: error.message }));
  }
}

function getAllHolidayTokens() {
  return [
    ...getHolidayTokenSource(settings.autoHolidayRanges)
  ];
}

function getHolidayTokenSource(value) {
  return String(value || '')
    .split(/[,，\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function maybeRefreshAutoHolidays() {
  const year = getHolidayFetchYear();
  if (String(settings.holidaySourceYear) === String(year) && settings.autoHolidayRanges) return;
  window.setTimeout(() => refreshAutoHolidays({ year }), 0);
}

async function refreshAutoHolidays(options = {}) {
  const year = Number(options.year || getHolidayFetchYear());
  try {
    const ranges = await fetchChinaHolidayRanges(year);
    applyAutoHolidayRanges(ranges, year, t('holidaySourceNetwork'));
  } catch (error) {
    const fallbackRanges = getFallbackHolidayRanges(year);
    if (fallbackRanges.length) {
      applyAutoHolidayRanges(fallbackRanges, year, t('holidaySourceBuiltIn'));
    } else {
      console.debug('Holiday refresh failed', error);
    }
  }
}

async function fetchChinaHolidayRanges(year) {
  const res = await fetch(`${HOLIDAY_API_URL}${year}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const dates = Object.values(data.holiday || {})
    .filter((item) => item?.holiday)
    .map((item) => normalizeHolidayDateText(item.date, year))
    .filter(Boolean)
    .sort();
  if (!dates.length) throw new Error('未获取到节假日数据');
  return compactDateTokens(dates);
}

function applyAutoHolidayRanges(ranges, year, sourceName) {
  settings = {
    ...settings,
    autoHolidayRanges: ranges.join(', '),
    holidaySourceYear: String(year),
    holidaySourceName: sourceName,
    holidaySourceUpdatedAt: new Date().toISOString()
  };
  holidayRangeCacheKey = null;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  updateHolidaySyncStatus();
  renderWeek();
  renderTimetable();
  renderToday();
}

function getFallbackHolidayRanges(year) {
  return FALLBACK_CHINA_HOLIDAYS[year] || [];
}

function getHolidayFetchYear() {
  return parseDate(getSemesterStart()).getFullYear();
}

function compactDateTokens(dateTexts) {
  const dates = [...new Set(dateTexts)].map(parseDate).sort((a, b) => a - b);
  const ranges = [];
  let start = null;
  let prev = null;
  dates.forEach((date) => {
    if (!start) {
      start = date;
      prev = date;
      return;
    }
    const nextOfPrev = addDays(prev, 1);
    if (date.getTime() === nextOfPrev.getTime()) {
      prev = date;
      return;
    }
    ranges.push(formatHolidayToken(start, prev));
    start = date;
    prev = date;
  });
  if (start) ranges.push(formatHolidayToken(start, prev));
  return ranges;
}

function formatHolidayToken(start, end) {
  const startText = formatDateInput(start);
  const endText = formatDateInput(end);
  return startText === endText ? `${startText}..${endText}` : `${startText}..${endText}`;
}

function normalizeHolidayDateText(value, fallbackYear = getHolidayFetchYear()) {
  const text = String(value || '').trim();
  const fullText = /^\d{1,2}-\d{1,2}$/.test(text) ? `${fallbackYear}-${text}` : text;
  const match = fullText.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return '';
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function updateHolidaySyncStatus() {
  const status = document.getElementById('holidaySyncStatus');
  if (!status) return;
  if (!settings.autoHolidayRanges) {
    status.textContent = '联网失败时会使用内置数据。';
    return;
  }
  const source = settings.holidaySourceName || '节假日数据';
  const year = settings.holidaySourceYear || getHolidayFetchYear();
  status.textContent = `${source} · ${year} 年`;
}

function setHolidaySyncStatus(message) {
  const status = document.getElementById('holidaySyncStatus');
  if (status) status.textContent = message;
}

function readSettingsControls() {
  settings = {
    ...settings,
    languageMode: getSelectedLanguageMode(),
    showWeekend: Boolean(els.settings.showWeekend?.checked),
    semesterStart: els.settings.semesterStart?.value || state.semesterStart,
    semesterWeeks: toPositiveInt(els.settings.semesterWeeks?.value, state.semesterWeeks),
    visibleFields: getVisibleFieldInputs().filter((input) => input.checked).map((input) => input.value),
    cellHeight: toPositiveInt(els.settings.cellHeight?.value, DEFAULT_SETTINGS.cellHeight),
    cellRadius: toPositiveInt(els.settings.cellRadius?.value, DEFAULT_SETTINGS.cellRadius),
    cellGap: toPositiveInt(els.settings.cellGap?.value, DEFAULT_SETTINGS.cellGap),
    courseOpacity: clampNumber(Number(els.settings.courseOpacity?.value), 0.2, 1, DEFAULT_SETTINGS.courseOpacity),
    cardOpacity: clampNumber(Number(els.settings.cardOpacity?.value), 0, 1, DEFAULT_SETTINGS.cardOpacity)
  };
  if (!settings.visibleFields.length) settings.visibleFields = ['name'];
  holidayRangeCacheKey = null;
  applyAppearanceSettings();
  applyLanguage();
  persistSettingsSoon();
  syncScheduleToAndroid();
  activeWeek = clampMinWeek(activeWeek);
  populateCourseSelectors();
  scheduleRender({ dayTabs: true, week: true, timetable: true, today: true, form: true });
  maybeRefreshAutoHolidays();
}

function applyAppearanceSettings() {
  const cardOpacity = clampNumber(Number(settings.cardOpacity), 0, 1, DEFAULT_SETTINGS.cardOpacity);
  const blurAmount = FIXED_BLUR_AMOUNT;
  const glassBlur = blurAmount;
  document.documentElement.style.setProperty('--card-opacity', String(cardOpacity));
  document.documentElement.style.setProperty('--blur', `${blurAmount}px`);
  document.documentElement.style.setProperty('--effective-blur', `${blurAmount}px`);
  document.documentElement.style.setProperty('--glass-blur', `${glassBlur}px`);
  document.documentElement.style.setProperty('--surface-blur', `${glassBlur}px`);
  document.documentElement.style.setProperty('--field-blur', `${Math.min(blurAmount * 0.55, 22)}px`);
  document.documentElement.style.setProperty('--mobile-field-blur', `${Math.min(blurAmount * 0.42, 18)}px`);
  document.documentElement.style.setProperty('--page-overlay-alpha', String(cardOpacity * 0.18));
  document.documentElement.style.setProperty('--bg-image-opacity', String(1 - cardOpacity * 0.28));
  document.documentElement.style.setProperty('--card-alpha-outer', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-panel', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-panel-mobile', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-panel-strong-mobile', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-grid', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-chip', String(cardOpacity * 0.75));
  document.documentElement.style.setProperty('--card-alpha-control', String(cardOpacity * 0.75));
  document.documentElement.style.setProperty('--card-alpha-tab', String(cardOpacity));
  document.documentElement.style.setProperty('--card-alpha-field', String(cardOpacity * 0.75));
  const courseOpacity = clampNumber(Number(settings.courseOpacity), 0.2, 1, DEFAULT_SETTINGS.courseOpacity);
  document.documentElement.style.setProperty('--course-color-alpha', String(courseOpacity));
  document.documentElement.style.setProperty('--course-surface-alpha', String(Math.min(courseOpacity * 0.58, 0.58)));
}

function getVisibleFieldInputs() {
  const root = els.settings.visibleFields;
  if (!root) return [...document.querySelectorAll('input[name="visibleFields"], input[data-visible-field]')];
  if (root.matches?.('input[type="checkbox"]')) return [root];
  return [...root.querySelectorAll('input[type="checkbox"]')];
}

function getLanguageModeInputs() {
  return [...document.querySelectorAll('input[name="languageMode"]')];
}

function getSelectedLanguageMode() {
  const selected = getLanguageModeInputs().find((input) => input.checked)?.value;
  return LANGUAGE_MODES.includes(selected) ? selected : DEFAULT_SETTINGS.languageMode;
}

function injectTimetableStyles() {
  if (document.getElementById('timetableRuntimeStyles')) return;
  const style = document.createElement('style');
  style.id = 'timetableRuntimeStyles';
  style.textContent = `
    #courseList.timetable {
      display: grid;
      gap: 12px;
    }
    #courseList .timetable-grid {
      align-items: stretch;
      isolation: isolate;
      overflow-x: hidden;
      padding-bottom: 10px;
    }
    #courseList .timetable-header,
    #courseList .timetable-cell {
      border: 1px solid rgba(255, 255, 255, .58);
      border-radius: var(--cell-radius);
      background: rgba(255, 255, 255, .34);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, .58);
    }
    #courseList .timetable-header {
      display: grid;
      place-items: center;
      min-height: 44px;
      padding: 8px;
      color: var(--ink-soft);
      font-weight: 800;
      position: sticky;
      top: 0;
      z-index: 30;
      backdrop-filter: blur(var(--effective-blur));
      -webkit-backdrop-filter: blur(var(--effective-blur));
    }
    #courseList .timetable-cell {
      min-height: var(--cell-height);
    }
    #courseList .time-cell {
      min-height: var(--cell-height);
      border-radius: var(--cell-radius);
      font-size: 12px;
      gap: 2px;
    }
    #courseList .time-cell strong {
      color: var(--blue);
      font-size: 16px;
    }
    #courseList .timetable-course {
      cursor: pointer;
      min-width: 0;
      padding: 10px;
      animation: none;
    }
    #courseList .timetable-course h3 {
      font-size: clamp(14px, 1.8vw, 18px);
      overflow-wrap: anywhere;
    }
    #courseList .timetable-course .course-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 0;
    }
    #courseList .holiday-hint {
      margin: 0;
      border: 1px solid rgba(189, 116, 24, .24);
      border-radius: var(--radius-md);
      padding: 10px 12px;
      background: var(--amber-soft);
    }
  `;
  document.head.appendChild(style);
}

function isHolidayWeek(week) {
  if (week > getSemesterWeeks()) return true;
  return parseHolidayRanges().some((range) => {
    if (range.type === 'week') return week >= range.start && week <= range.end;
    const weekStart = startOfWeek(addDays(parseDate(getSemesterStart()), (week - 1) * 7));
    const weekEnd = addDays(weekStart, 6);
    return weekStart <= range.end && weekEnd >= range.start;
  });
}

function isHolidayDate(date) {
  const target = normalizeDate(date);
  if (getWeekForDate(target) > getSemesterWeeks()) return true;
  return parseHolidayRanges().some((range) => {
    if (range.type === 'week') {
      const week = getWeekForDate(target);
      return week >= range.start && week <= range.end;
    }
    return target >= range.start && target <= range.end;
  });
}

function parseHolidayRanges() {
  const key = getAllHolidayTokens().join('|');
  if (key === holidayRangeCacheKey) return holidayRangeCache;
  holidayRangeCacheKey = key;
  holidayRangeCache = getAllHolidayTokens()
    .map((part) => {
      const dateRange = part.split(/\.\.|~|至|到/).map((item) => item.trim());
      if (dateRange.length === 2 && isDateText(dateRange[0]) && isDateText(dateRange[1])) {
        return { type: 'date', start: parseDate(dateRange[0]), end: parseDate(dateRange[1]) };
      }
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((item) => Number(item.trim()));
        if (Number.isFinite(start) && Number.isFinite(end)) return { type: 'week', start, end };
      }
      const week = Number(part);
      return Number.isFinite(week) ? { type: 'week', start: week, end: week } : null;
    })
    .filter(Boolean);
  return holidayRangeCache;
}

function isDateText(value) {
  return /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
}

function fillForm(course) {
  els.editorTitle.textContent = t('editCourse');
  els.fields.id.value = course.id;
  els.fields.name.value = course.name;
  els.fields.teacher.value = course.teacher;
  els.fields.location.value = course.location;
  els.fields.dayOfWeek.value = course.dayOfWeek;
  setSelectValue(els.fields.weeks, course.weeks, `${course.weeks} ${t('weekUnit')}`);
  if (els.fields.weekParity) els.fields.weekParity.value = normalizeWeekParity(course.weekParity);
  setSelectValue(els.fields.startSection, String(course.startSection), t('sectionOption', { number: course.startSection, time: '' }));
  setSelectValue(els.fields.endSection, String(course.endSection), t('sectionOption', { number: course.endSection, time: '' }));
  if (els.fields.customTimeEnabled) els.fields.customTimeEnabled.checked = Boolean(course.customTimeEnabled);
  els.fields.startTime.value = course.startTime;
  els.fields.endTime.value = course.endTime;
  updateCustomTimeControls();
  refreshCustomSelects();
  els.deleteBtn.disabled = false;
  showPage('editPage');
}

function resetForm(openEditor = true) {
  els.editorTitle.textContent = t('newCourse');
  els.form.reset();
  els.fields.id.value = '';
  els.fields.dayOfWeek.value = activeDay;
  els.fields.weeks.value = `1-${getSemesterWeeks()}`;
  if (els.fields.weekParity) els.fields.weekParity.value = 'all';
  els.fields.startSection.value = 1;
  els.fields.endSection.value = 2;
  els.fields.startTime.value = getSlotTime(1, 'startTime') || '08:00';
  els.fields.endTime.value = getSlotTime(2, 'endTime') || '09:40';
  if (els.fields.customTimeEnabled) els.fields.customTimeEnabled.checked = false;
  updateCustomTimeControls();
  refreshCustomSelects();
  els.deleteBtn.disabled = true;
  if (openEditor) showPage('editPage');
}

function setSelectValue(select, value, label = value) {
  if (!select) return;
  const text = String(value || '');
  if (![...select.options].some((option) => option.value === text)) {
    const option = document.createElement('option');
    option.value = text;
    option.textContent = label;
    select.appendChild(option);
  }
  select.value = text;
}

function resetFormAt(day, section) {
  const slot = getDisplayTimeSlots().find((item) => item.number === Number(section));
  resetForm(false);
  activeDay = normalizeDay(day);
  els.fields.dayOfWeek.value = activeDay;
  els.fields.startSection.value = String(section);
  els.fields.endSection.value = String(section);
  els.fields.startTime.value = slot?.startTime || getSlotTime(section, 'startTime') || '08:00';
  els.fields.endTime.value = slot?.endTime || getSlotTime(section, 'endTime') || els.fields.startTime.value;
  updateCustomTimeControls();
  refreshCustomSelects();
  showPage('editPage');
}

function syncSectionTimeDefaults() {
  const startSection = Number(els.fields.startSection?.value || 1);
  const endSection = Number(els.fields.endSection?.value || startSection);
  if (endSection < startSection && els.fields.endSection) {
    els.fields.endSection.value = String(startSection);
  }
  const normalizedEnd = Number(els.fields.endSection?.value || startSection);
  els.fields.startTime.value = getSlotTime(startSection, 'startTime') || els.fields.startTime.value || '08:00';
  els.fields.endTime.value = getSlotTime(normalizedEnd, 'endTime') || els.fields.endTime.value || els.fields.startTime.value;
  refreshCustomSelects();
}

function updateCustomTimeControls() {
  const enabled = Boolean(els.fields.customTimeEnabled?.checked);
  const row = document.getElementById('customTimeRow');
  if (row) row.hidden = !enabled;
  const sectionRow = document.getElementById('sectionRow');
  if (sectionRow) sectionRow.hidden = enabled;
  if (els.fields.startTime) els.fields.startTime.disabled = !enabled;
  if (els.fields.endTime) els.fields.endTime.disabled = !enabled;
}

function getSlotTime(number, key) {
  return (state.timeSlots || []).find((slot) => slot.number === number)?.[key] || '';
}

function deleteCourse() {
  const id = els.fields.id.value;
  if (!id) {
    resetForm();
    return;
  }
  addDeletedId(id);
  state.courses = state.courses.filter((course) => course.id !== id);
  persist();
  renderTimetable();
  renderToday();
  resetForm(false);
  showPage('schedulePage');
  showStatus(t('courseDeleted'));
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return `course-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createCourseId(course) {
  const raw = [
    course.name,
    course.teacher,
    course.location,
    course.dayOfWeek,
    course.startSection,
    course.endSection,
    course.startTime,
    course.endTime
  ].join('|');
  return `remote-${encodeURIComponent(raw).replace(/%/g, '').slice(0, 80)}`;
}

function getDeletedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(DELETED_KEY)) || []);
  } catch {
    localStorage.removeItem(DELETED_KEY);
    return new Set();
  }
}

function addDeletedId(id) {
  const ids = getDeletedIds();
  ids.add(id);
  localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]));
}

function removeDeletedId(id) {
  const ids = getDeletedIds();
  ids.delete(id);
  localStorage.setItem(DELETED_KEY, JSON.stringify([...ids]));
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncScheduleToAndroid();
}

function syncScheduleToAndroid() {
  try {
    const semesterStart = getSemesterStart();
    const semesterWeeks = getSemesterWeeks();
    const scheduleForWidget = {
      ...state,
      semesterStart,
      semesterWeeks,
      config: {
        ...(state.config || {}),
        semesterStartDate: semesterStart,
        semesterTotalWeeks: semesterWeeks
      }
    };
    window.ScheduleBridge?.saveSchedule?.(JSON.stringify(scheduleForWidget));
  } catch (error) {
    console.debug('Android schedule sync skipped', error);
  }
}

function isRemoteScheduleDisabled() {
  return localStorage.getItem(REMOTE_DISABLED_KEY) === '1';
}

function disableRemoteSchedule() {
  localStorage.setItem(REMOTE_DISABLED_KEY, '1');
}

function refreshScheduleView(message) {
  activeWeek = clampMinWeek(getCurrentWeek(getSemesterStart()));
  writeSettingsControls();
  writeTimeSlotsControl();
  applyAppearanceSettings();
  renderDayTabs();
  renderWeek();
  renderTimetable();
  renderToday();
  resetForm(false);
  if (message) showStatus(message);
}

function clearSchedule() {
  if (!window.confirm(t('confirmClear'))) return;

  const deletedIds = new Set([...getDeletedIds(), ...(state.courses || []).map((course) => course.id).filter(Boolean)]);
  localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedIds]));
  disableRemoteSchedule();
  state = normalizeSchedule({
    semesterStart: getSemesterStart(),
    semesterWeeks: getSemesterWeeks(),
    timeSlots: state.timeSlots,
    config: state.config,
    courses: []
  });
  persist();
  refreshScheduleView(t('scheduleCleared'));
}

function importScheduleJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const imported = normalizeSchedule(JSON.parse(String(reader.result || '{}')));
      state = imported;
      settings = {
        ...settings,
        semesterStart: imported.semesterStart,
        semesterWeeks: imported.semesterWeeks
      };
      holidayRangeCacheKey = null;
      weekMatchCache.clear();
      localStorage.removeItem(DELETED_KEY);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      persist();
      refreshScheduleView(t('jsonImported'));
    } catch (error) {
      showStatus(t('importFailed', { message: error.message }));
    } finally {
      event.target.value = '';
    }
  });
  reader.addEventListener('error', () => {
    showStatus(t('importReadFailed'));
    event.target.value = '';
  });
  reader.readAsText(file, 'utf-8');
}

function exportScheduleJson() {
  const payload = {
    semesterStart: getSemesterStart(),
    semesterWeeks: getSemesterWeeks(),
    timeSlots: state.timeSlots,
    config: {
      ...(state.config || {}),
      semesterStartDate: getSemesterStart(),
      semesterTotalWeeks: getSemesterWeeks()
    },
    courses: state.courses || []
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `shiguangschedule_${formatDateStamp(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  showStatus(t('jsonExported'));
}

function showPage(pageId) {
  if (pageId === 'schedulePage') {
    activeWeek = clampMinWeek(getCurrentWeek(getSemesterStart()));
    renderWeek();
    renderTimetable();
    resetForm(false);
  }

  document.querySelectorAll('.page').forEach((page) => {
    page.classList.toggle('active', page.id === pageId);
  });
  els.pageTabs.forEach((tab) => {
    const active = tab.dataset.page === pageId;
    tab.classList.toggle('active', active);
    if (active) {
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.removeAttribute('aria-current');
    }
  });
}

function changeWeek(delta) {
  activeWeek = clampMinWeek(activeWeek + delta);
  renderWeek();
  renderTimetable();
  renderToday();
  resetForm(false);
}

function bindWeekSwipe() {
  const viewport = els.courseList;
  if (!viewport) return;

  const prefersReducedMotion = () =>
    Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const getTrack = () => viewport.querySelector('.timetable-track');

  let startX = 0;
  let startY = 0;
  let active = false;
  let locked = false;
  let animating = false;
  let width = 1;

  const commitWeek = (dir, track) => {
    suppressGridClickUntil = Date.now() + 400;
    if (prefersReducedMotion() || !track) {
      changeWeek(dir);
      return;
    }
    animating = true;
    const out = dir === 1 ? -100 : 100;
    let done = false;
    const finishAnim = (event) => {
      if (event && event.target !== track) return;
      if (done) return;
      done = true;
      track.removeEventListener('transitionend', finishAnim);
      changeWeek(dir);
      const next = getTrack();
      if (next) {
        next.style.transition = 'none';
        next.style.transform = `translateX(${-out}%)`;
        void next.offsetWidth;
        next.style.transition = 'transform .22s ease';
        next.style.transform = 'translateX(0)';
      }
      animating = false;
    };
    track.style.transition = 'transform .22s ease';
    window.requestAnimationFrame(() => {
      track.style.transform = `translateX(${out}%)`;
    });
    track.addEventListener('transitionend', finishAnim);
    window.setTimeout(finishAnim, 360);
  };

  viewport.addEventListener('pointerdown', (event) => {
    if (animating) return;
    if (event.target.closest('.timetable-course, button, input, textarea, select, a')) return;
    startX = event.clientX;
    startY = event.clientY;
    active = true;
    locked = false;
    width = viewport.clientWidth || 1;
    const track = getTrack();
    if (track) track.style.transition = 'none';
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!active || animating) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        active = false;
        return;
      }
      locked = true;
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch (error) {
        /* ignore capture errors */
      }
    }
    const track = getTrack();
    if (!track) return;
    const atStart = clampMinWeek(activeWeek - 1) === activeWeek;
    const move = atStart && dx > 0 ? dx * 0.35 : dx;
    track.style.transform = `translateX(${move}px)`;
  });

  const release = (event) => {
    if (!active) return;
    active = false;
    if (!locked) return;
    locked = false;
    const track = getTrack();
    const dx = event.clientX - startX;
    const dir = dx < 0 ? 1 : -1;
    const threshold = Math.max(64, width * 0.25);
    if (track && Math.abs(dx) >= threshold && clampMinWeek(activeWeek + dir) !== activeWeek) {
      commitWeek(dir, track);
    } else if (track) {
      track.style.transition = 'transform .2s ease';
      track.style.transform = 'translateX(0)';
    }
  };

  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', () => {
    active = false;
    locked = false;
    const track = getTrack();
    if (track) {
      track.style.transition = 'transform .2s ease';
      track.style.transform = 'translateX(0)';
    }
  });
}

function jumpToToday() {
  const activePageId = document.querySelector('.page.active')?.id;
  activeWeek = clampMinWeek(getCurrentWeek(getSemesterStart()));
  renderWeek();
  renderTimetable();
  renderToday();
  resetForm(false);
  if (activePageId === 'schedulePage') {
    showStatus(t('backToCurrentWeek'));
    return;
  }
  showPage(document.getElementById('todayPage') ? 'todayPage' : 'schedulePage');
}

function changeBackground(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localStorage.setItem(BG_KEY, reader.result);
    applyBackground(reader.result);
    showStatus(t('backgroundSaved'));
  });
  reader.readAsDataURL(file);
}

function restoreBackground() {
  const bg = localStorage.getItem(BG_KEY);
  if (bg) applyBackground(bg);
}

function applyBackground(value) {
  if (!els.bgLayer) return;
  const imageValue = `url(${JSON.stringify(value)})`;
  els.bgLayer.style.backgroundImage = imageValue;
  document.body.classList.add('has-custom-bg');
}

function getSemesterStart() {
  return settings.semesterStart || state.semesterStart || fallbackSchedule.semesterStart;
}

function getSemesterWeeks() {
  return toPositiveInt(settings.semesterWeeks, state.semesterWeeks || fallbackSchedule.semesterWeeks);
}

function getCurrentWeek(semesterStart) {
  const start = startOfWeek(parseDate(semesterStart));
  const today = startOfWeek(new Date());
  const diff = today.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
}

function getWeekForDate(date) {
  const start = startOfWeek(parseDate(getSemesterStart()));
  const target = startOfWeek(date);
  const diff = target.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
}

function getTodayDay() {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

function includesCourseWeek(course, week) {
  const parity = normalizeWeekParity(course.weekParity);
  if (parity === 'odd' && week % 2 !== 1) return false;
  if (parity === 'even' && week % 2 !== 0) return false;
  return includesWeek(course.weeks, week);
}

function includesWeek(value, week) {
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .some((part) => {
      if (!part) return false;
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        return week >= start && week <= end;
      }
      return Number(part) === week;
    });
}

function parseDate(value) {
  const [year, month, day] = String(value).split('-').map(Number);
  return normalizeDate(new Date(year || 2026, (month || 1) - 1, day || 1));
}

function normalizeDate(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfWeek(date) {
  const result = new Date(date);
  const day = result.getDay() || 7;
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - day + 1);
  return result;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function formatDateInput(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateStamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toPositiveInt(value, fallback) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function clampWeek(value, max) {
  return Math.min(Math.max(1, value), Math.max(1, max));
}

function clampMinWeek(value) {
  return Math.max(1, Number(value) || 1);
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function showStatus(message) {
  if (els.todaySummary) els.todaySummary.textContent = message;
  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => {
    renderToday();
  }, 2200);
}

const STORAGE_KEY = 'roommate-schedule:v1';
const BG_KEY = 'roommate-schedule:bg';
const DELETED_KEY = 'roommate-schedule:deleted';
const SETTINGS_KEY = 'roommate-schedule:settings:v1';
const DAILY_POEM_KEY = 'roommate-schedule:daily-poem:v1';
const REMOTE_DISABLED_KEY = 'roommate-schedule:remote-disabled';
const DEFAULT_REMOTE_URL = 'https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json';
const DAILY_POEM_URL = 'https://v1.jinrishici.com/all.json';
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
  showWeekend: false,
  semesterStart: '',
  semesterWeeks: 16,
  holidayRanges: '',
  visibleFields: ['name', 'teacher', 'location', 'time', 'weeks'],
  cellHeight: 72,
  cellRadius: 8,
  cellGap: 6,
  courseOpacity: 0.92,
  cardOpacity: 0.42
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
    showStatus(options.auto ? '已自动读取课表，并合并本地修改' : '已读取课表，并保留本地修改');
  } catch (error) {
    if (!options.auto) showStatus(`读取失败，继续使用本地缓存：${error.message}`);
    else showStatus('远程读取失败，已使用本地缓存或内置 fallback');
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
      showStatus('请填写自定义开始和结束时间');
      return;
    }
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      showStatus('结束时间需晚于开始时间');
      return;
    }
    startSection = findSlotByTime(state.timeSlots, startTime, 'startTime') || 1;
    endSection = findSlotByTime(state.timeSlots, endTime, 'endTime') || startSection;
    if (endSection < startSection) endSection = startSection;
  } else {
    startSection = Number(els.fields.startSection.value);
    endSection = Number(els.fields.endSection.value);
    if (endSection < startSection) {
      showStatus('结束节不能早于开始节');
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
  showStatus('已保存到本地缓存');
}

function renderWeek() {
  const start = startOfWeek(addDays(parseDate(getSemesterStart()), (activeWeek - 1) * 7));
  const end = addDays(start, 6);
  populateWeekOptions();
  if (els.todayText) {
    els.todayText.textContent = new Intl.DateTimeFormat('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    }).format(new Date());
  }
  if (els.weekLabel) els.weekLabel.textContent = `第 ${activeWeek} 周`;
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
  return from ? `${content} —— ${from}` : content;
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
    els.fields.dayOfWeek.innerHTML = DAY_NAMES.map((name, index) => (
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
    { value: `1-${total}`, label: `全学期（1-${total} 周）` },
    { value: String(activeWeek), label: `当前第 ${activeWeek} 周` }
  ];
  const half = Math.floor(total / 2);
  if (half >= 1 && half < total) {
    options.push({ value: `1-${half}`, label: `前半学期（1-${half} 周）` });
    options.push({ value: `${half + 1}-${total}`, label: `后半学期（${half + 1}-${total} 周）` });
  }
  for (let week = 1; week <= total; week += 1) {
    options.push({ value: String(week), label: `第 ${week} 周` });
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
    const label = `第 ${slot.number} 节${time ? ` · ${time}` : ''}`;
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
    [els.fields.dayOfWeek, '选择星期'],
    [els.fields.weeks, '选择上课周次'],
    [els.fields.weekParity, '选择单双周'],
    [els.fields.startSection, '选择开始节'],
    [els.fields.endSection, '选择结束节']
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
  button.addEventListener('click', () => openSelectPicker(select, title));
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
  button.textContent = selected?.textContent || '请选择';
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
    options.push({ value: String(week), label: week > getSemesterWeeks() ? `第 ${week} 周 · 假期中` : `第 ${week} 周` });
  }
  openOptionPicker({
    title: '切换周次',
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
  heading.innerHTML = `<strong>${escapeHtml(title)}</strong><button type="button" aria-label="关闭">×</button>`;
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
  const dayColumns = new Map(visibleDays.map((day, index) => [day, index + 2]));
  const slotRows = new Map(slots.map((slot, index) => [slot.number, index + 2]));
  const courses = state.courses
    .filter((course) => visibleDays.includes(course.dayOfWeek) && includesCourseWeek(course, activeWeek))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startSection - b.startSection);
  const isHoliday = isHolidayWeek(activeWeek);

  if (els.activeDayText) els.activeDayText.textContent = isHoliday ? '假期中' : '本周课表';
  if (els.courseCount) els.courseCount.textContent = isHoliday ? `第 ${activeWeek} 周` : (courses.length ? `${courses.length} 门课` : '本周无课');
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

  timetable.appendChild(createGridHeader('节次', 1, 1));
  visibleDays.forEach((day, index) => {
    timetable.appendChild(createGridHeader(getDayHeaderName(day), index + 2, 1, formatDayHeaderDate(weekStart, day)));
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
      cell.title = '点击新增课程';
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
    timetable.appendChild(createCourseBlock(course, dayColumn, startRow, endRow + 1, index, isHoliday));
  });

  fragment.appendChild(timetable);

  if (isHoliday) {
    const hint = document.createElement('p');
    hint.className = 'hint holiday-hint';
    hint.textContent = `第 ${activeWeek} 周是假期中，继续切换周次可以查看后续假期或下学期。`;
    fragment.insertBefore(hint, timetable);
  }

  if (!courses.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = isHoliday ? '假期中，暂无课程。' : '这一周没有课程。';
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
  const todayCourses = state.courses
    .filter((course) => course.dayOfWeek === todayDay && includesCourseWeek(course, todayWeek))
    .sort((a, b) => a.startSection - b.startSection || String(a.startTime).localeCompare(String(b.startTime)));
  const isHoliday = isHolidayWeek(todayWeek);
  const dayText = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(today);

  els.todaySummary.textContent = isHoliday
    ? `${dayText} · 第 ${todayWeek} 周 · 假期中`
    : `${dayText} · 第 ${todayWeek} 周 · ${todayCourses.length ? `${todayCourses.length} 门课` : '今天没课'}`;
  const fragment = document.createDocumentFragment();

  if (!todayCourses.length) {
    const empty = document.createElement('div');
    empty.className = 'empty today-empty';
    empty.textContent = isHoliday ? '今天是假期中，好好休息。' : '今天没有安排课程。';
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
        <p>${escapeHtml(course.teacher)} · ${escapeHtml(course.location)}</p>
        <span>第 ${course.startSection}-${course.endSection} 节</span>
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

function createGridHeader(text, column, row, subtext = '') {
  const header = document.createElement('div');
  header.className = 'timetable-header';
  header.style.gridColumn = String(column);
  header.style.gridRow = String(row);
  if (subtext) {
    const title = document.createElement('strong');
    title.textContent = text;
    const date = document.createElement('span');
    date.textContent = subtext;
    header.append(title, date);
  } else {
    header.textContent = text;
  }
  return header;
}

function getDayHeaderName(day) {
  return window.matchMedia('(max-width: 640px)').matches ? SHORT_DAY_NAMES[day - 1] : DAY_NAMES[day - 1];
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
  cell.innerHTML = `<strong>第${slot.number}节</strong><span>${timeText}</span>`;
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
  block.title = '点击编辑课程';
  return block;
}

function getCourseDetails(course) {
  const fields = new Set(settings.visibleFields);
  const details = [];
  if (fields.has('teacher')) details.push(course.teacher);
  if (fields.has('location')) details.push(course.location);
  if (fields.has('time')) details.push(`${course.startTime || ''}-${course.endTime || ''}`.replace(/^-|-$/g, ''));
  if (fields.has('weeks')) details.push(`${course.weeks} 周`);
  if (fields.has('sections')) details.push(`${course.startSection}-${course.endSection} 节`);
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
    <label class="field"><span>周末课程</span><input id="showWeekend" type="checkbox"></label>
    <div class="form-row">
      <label class="field"><span>学期开始日期</span><input id="semesterStart" type="date"></label>
      <label class="field"><span>总周数</span><input id="semesterWeeks" type="number" min="1" max="30"></label>
    </div>
    <div class="picker-field"><span>假期周/日期范围</span><div id="holidayList" class="picker-list"></div><button type="button" id="addHolidayBtn" class="picker-add">+ 添加假期</button></div>
    <fieldset class="field" id="visibleFields">
      <legend>课程块字段</legend>
      <label><input type="checkbox" value="teacher"> 老师</label>
      <label><input type="checkbox" value="location"> 地点</label>
      <label><input type="checkbox" value="time"> 时间</label>
      <label><input type="checkbox" value="weeks"> 周次</label>
      <label><input type="checkbox" value="sections"> 节次</label>
    </fieldset>
    <div class="form-row">
      <label class="field"><span>单元高度</span><input id="cellHeight" type="number" min="48" max="160"></label>
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
  document.getElementById('addHolidayBtn')?.addEventListener('click', addHolidayRow);
  document.getElementById('addTimeSlotBtn')?.addEventListener('click', addTimeSlotRow);
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
  if (els.settings.showWeekend) els.settings.showWeekend.checked = settings.showWeekend;
  if (els.settings.semesterStart) els.settings.semesterStart.value = settings.semesterStart;
  if (els.settings.semesterWeeks) els.settings.semesterWeeks.value = settings.semesterWeeks;
  renderHolidayRows();
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
  numberEl.textContent = `第${number}节`;
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
  remove.setAttribute('aria-label', '删除节次');
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
    el.textContent = `第${index + 1}节`;
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
      if (timeToMinutes(endTime) <= timeToMinutes(startTime)) throw new Error(`第 ${index + 1} 节结束时间需晚于开始时间`);
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
    showStatus('课程时间已保存');
  } catch (error) {
    showStatus(`时间格式错误：${error.message}`);
  }
}

function getHolidayTokens() {
  return String(settings.holidayRanges || '')
    .split(/[,，;\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitHolidayDateToken(token) {
  const parts = token.split(/\.\.|~|至|到/).map((item) => item.trim());
  if (parts.length === 2 && isDateText(parts[0]) && isDateText(parts[1])) {
    return { start: parts[0], end: parts[1] };
  }
  return null;
}

function createHolidayRow(start = '', end = '') {
  const row = document.createElement('div');
  row.className = 'picker-row holiday-row';
  const startInput = document.createElement('input');
  startInput.type = 'date';
  startInput.className = 'holiday-start';
  startInput.value = start || '';
  const sep = document.createElement('span');
  sep.className = 'picker-sep';
  sep.textContent = '~';
  const endInput = document.createElement('input');
  endInput.type = 'date';
  endInput.className = 'holiday-end';
  endInput.value = end || '';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'picker-remove';
  remove.setAttribute('aria-label', '删除假期');
  remove.textContent = '×';
  remove.addEventListener('click', () => {
    row.remove();
    readHolidayRows();
  });
  startInput.addEventListener('change', readHolidayRows);
  endInput.addEventListener('change', readHolidayRows);
  row.append(startInput, sep, endInput, remove);
  return row;
}

function renderHolidayRows() {
  const list = document.getElementById('holidayList');
  if (!list) return;
  const rows = getHolidayTokens()
    .map(splitHolidayDateToken)
    .filter(Boolean)
    .map((range) => createHolidayRow(range.start, range.end));
  list.replaceChildren(...rows);
}

function readHolidayRows() {
  const list = document.getElementById('holidayList');
  if (!list) return;
  const dateTokens = [...list.querySelectorAll('.holiday-row')]
    .map((row) => {
      const start = row.querySelector('.holiday-start')?.value || '';
      const end = row.querySelector('.holiday-end')?.value || '';
      return start && end ? `${start}..${end}` : '';
    })
    .filter(Boolean);
  const weekTokens = getHolidayTokens().filter((token) => !splitHolidayDateToken(token));
  settings.holidayRanges = [...dateTokens, ...weekTokens].join(', ');
  holidayRangeCacheKey = null;
  persistSettingsSoon();
  renderWeek();
  renderTimetable();
  renderToday();
}

function addHolidayRow() {
  const list = document.getElementById('holidayList');
  if (!list) return;
  list.appendChild(createHolidayRow());
}

function readSettingsControls() {
  settings = {
    ...settings,
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
  applyAppearanceSettings();
  persistSettingsSoon();
  syncScheduleToAndroid();
  activeWeek = clampMinWeek(activeWeek);
  populateCourseSelectors();
  scheduleRender({ dayTabs: true, week: true, timetable: true, today: true, form: true });
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
  return parseHolidayRanges(settings.holidayRanges).some((range) => {
    if (range.type === 'week') return week >= range.start && week <= range.end;
    const weekStart = startOfWeek(addDays(parseDate(getSemesterStart()), (week - 1) * 7));
    const weekEnd = addDays(weekStart, 6);
    return weekStart <= range.end && weekEnd >= range.start;
  });
}

function parseHolidayRanges(value) {
  return String(value || '')
    .split(/[,，;\n]/)
    .map((part) => part.trim())
    .filter(Boolean)
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
}

function isDateText(value) {
  return /^\d{4}-\d{1,2}-\d{1,2}$/.test(value);
}

function fillForm(course) {
  els.editorTitle.textContent = '编辑课程';
  els.fields.id.value = course.id;
  els.fields.name.value = course.name;
  els.fields.teacher.value = course.teacher;
  els.fields.location.value = course.location;
  els.fields.dayOfWeek.value = course.dayOfWeek;
  setSelectValue(els.fields.weeks, course.weeks, `${course.weeks} 周`);
  if (els.fields.weekParity) els.fields.weekParity.value = normalizeWeekParity(course.weekParity);
  setSelectValue(els.fields.startSection, String(course.startSection), `第 ${course.startSection} 节`);
  setSelectValue(els.fields.endSection, String(course.endSection), `第 ${course.endSection} 节`);
  if (els.fields.customTimeEnabled) els.fields.customTimeEnabled.checked = Boolean(course.customTimeEnabled);
  els.fields.startTime.value = course.startTime;
  els.fields.endTime.value = course.endTime;
  updateCustomTimeControls();
  refreshCustomSelects();
  els.deleteBtn.disabled = false;
  showPage('editPage');
}

function resetForm(openEditor = true) {
  els.editorTitle.textContent = '新课程';
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
  showStatus('已删除');
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
  if (!window.confirm('确定清空当前课表吗？')) return;

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
  refreshScheduleView('课表已清空');
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
      refreshScheduleView('JSON 课表已导入');
    } catch (error) {
      showStatus(`导入失败：${error.message}`);
    } finally {
      event.target.value = '';
    }
  });
  reader.addEventListener('error', () => {
    showStatus('导入失败：无法读取文件');
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
  showStatus('JSON 课表已导出');
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
    showStatus('已回到本周课表');
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
    showStatus('背景已保存到本地');
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
  return new Date(year || 2026, (month || 1) - 1, day || 1);
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

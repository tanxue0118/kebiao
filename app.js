const STORAGE_KEY = 'roommate-schedule:v1';
const URL_KEY = 'roommate-schedule:url';
const BG_KEY = 'roommate-schedule:bg';
const DELETED_KEY = 'roommate-schedule:deleted';
const DEFAULT_REMOTE_URL = 'https://raw.githubusercontent.com/tanxue0118/kebiao/main/schedule.json';
const DAY_NAMES = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

const fallbackSchedule = {
  semesterStart: '2026-03-02',
  courses: [
    {
      id: 'demo-math',
      name: '高等数学',
      teacher: '王老师',
      location: '教学楼 A101',
      dayOfWeek: 1,
      weeks: '1-16',
      startSection: 1,
      endSection: 2,
      startTime: '08:00',
      endTime: '09:40'
    },
    {
      id: 'demo-english',
      name: '大学英语',
      teacher: '李老师',
      location: '综合楼 305',
      dayOfWeek: 3,
      weeks: '1-12',
      startSection: 5,
      endSection: 6,
      startTime: '14:00',
      endTime: '15:40'
    }
  ]
};

let state = loadSchedule();
let activeWeek = getCurrentWeek(state.semesterStart);
let activeDay = getTodayDay();

const els = {
  todayText: document.getElementById('todayText'),
  weekLabel: document.getElementById('weekLabel'),
  dateRange: document.getElementById('dateRange'),
  prevWeekBtn: document.getElementById('prevWeekBtn'),
  nextWeekBtn: document.getElementById('nextWeekBtn'),
  pageTabs: document.querySelectorAll('[data-page]'),
  remoteUrl: document.getElementById('remoteUrl'),
  loadBtn: document.getElementById('loadBtn'),
  resetRemoteBtn: document.getElementById('resetRemoteBtn'),
  bgInput: document.getElementById('bgInput'),
  bgLayer: document.getElementById('bgLayer'),
  syncHint: document.getElementById('syncHint'),
  dayTabs: document.getElementById('dayTabs'),
  activeDayText: document.getElementById('activeDayText'),
  courseCount: document.getElementById('courseCount'),
  courseList: document.getElementById('courseList'),
  addBtn: document.getElementById('addBtn'),
  form: document.getElementById('courseForm'),
  editorTitle: document.getElementById('editorTitle'),
  deleteBtn: document.getElementById('deleteBtn'),
  template: document.getElementById('courseTemplate'),
  fields: {
    id: document.getElementById('courseId'),
    name: document.getElementById('courseName'),
    teacher: document.getElementById('teacher'),
    location: document.getElementById('location'),
    dayOfWeek: document.getElementById('dayOfWeek'),
    weeks: document.getElementById('weeks'),
    startSection: document.getElementById('startSection'),
    endSection: document.getElementById('endSection'),
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime')
  }
};

init();

function init() {
  els.remoteUrl.value = localStorage.getItem(URL_KEY) || DEFAULT_REMOTE_URL;
  restoreBackground();
  renderDayTabs();
  renderWeek();
  renderCourses();
  resetForm(false);

  els.prevWeekBtn.addEventListener('click', () => changeWeek(-1));
  els.nextWeekBtn.addEventListener('click', () => changeWeek(1));
  els.pageTabs.forEach((tab) => tab.addEventListener('click', () => showPage(tab.dataset.page)));
  els.loadBtn.addEventListener('click', loadRemoteSchedule);
  els.resetRemoteBtn.addEventListener('click', resetRemoteUrl);
  els.bgInput.addEventListener('change', changeBackground);
  els.addBtn.addEventListener('click', () => resetForm());
  els.form.addEventListener('submit', saveCourse);
  els.deleteBtn.addEventListener('click', deleteCourse);
}

function loadSchedule() {
  try {
    const cached = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (cached && Array.isArray(cached.courses)) {
      return normalizeSchedule(cached);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return normalizeSchedule(fallbackSchedule);
}

function normalizeSchedule(schedule) {
  const timeSlots = Array.isArray(schedule.timeSlots) ? schedule.timeSlots : [];
  return {
    semesterStart: schedule.semesterStart || schedule.weekStartDate || schedule.config?.semesterStartDate || fallbackSchedule.semesterStart,
    courses: (schedule.courses || []).map((course) => {
      const [timeStart, timeEnd] = String(course.time || '').split('-');
      const startSlot = timeSlots.find((slot) => Number(slot.number) === Number(course.startSection || course.startPeriod));
      const endSlot = timeSlots.find((slot) => Number(slot.number) === Number(course.endSection || course.endPeriod || course.startSection || course.startPeriod));
      const normalized = {
        id: course.id || '',
        name: course.name || course.courseName || '未命名课程',
        teacher: course.teacher || '未填写老师',
        location: course.location || course.position || '未填写地点',
        dayOfWeek: Number(course.dayOfWeek || course.weekday || course.day || 1),
        weeks: normalizeWeeks(course.weeks || course.weekText || '1-16'),
        startSection: Number(course.startSection || course.startPeriod || 1),
        endSection: Number(course.endSection || course.endPeriod || course.startSection || course.startPeriod || 1),
        startTime: course.startTime || timeStart || startSlot?.startTime || '08:00',
        endTime: course.endTime || timeEnd || endSlot?.endTime || '08:45'
      };
      normalized.id = normalized.id || createCourseId(normalized);
      return normalized;
    })
  };
}

function normalizeWeeks(weeks) {
  if (Array.isArray(weeks)) return weeks.join(',');
  return String(weeks).replace(/第|周|单|双|\s/g, '');
}

async function loadRemoteSchedule() {
  const url = els.remoteUrl.value.trim();
  if (!url) {
    showStatus('先填 GitHub raw JSON 地址');
    return;
  }

  try {
    els.loadBtn.disabled = true;
    els.loadBtn.textContent = '读取中';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = normalizeSchedule(await res.json());
    state = mergeRemoteWithLocal(remote, state);
    activeWeek = getCurrentWeek(state.semesterStart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(URL_KEY, url);
    renderWeek();
    renderCourses();
    resetForm(false);
    showStatus('已读取 GitHub，并保留本地修改');
  } catch (error) {
    showStatus(`读取失败，继续使用本地缓存：${error.message}`);
  } finally {
    els.loadBtn.disabled = false;
  }
}

function mergeRemoteWithLocal(remote, local) {
  const deletedIds = getDeletedIds();
  const localCourses = new Map((local.courses || []).map((course) => [course.id, course]));
  const remoteIds = new Set();
  const mergedCourses = [];

  remote.courses.forEach((course) => {
    remoteIds.add(course.id);
    if (!deletedIds.has(course.id)) {
      mergedCourses.push(localCourses.get(course.id) || course);
    }
  });

  local.courses.forEach((course) => {
    if (!remoteIds.has(course.id) && !deletedIds.has(course.id)) {
      mergedCourses.push(course);
    }
  });

  return {
    semesterStart: remote.semesterStart,
    courses: mergedCourses
  };
}

function saveCourse(event) {
  event.preventDefault();
  const course = {
    id: els.fields.id.value || createId(),
    name: els.fields.name.value.trim(),
    teacher: els.fields.teacher.value.trim(),
    location: els.fields.location.value.trim(),
    dayOfWeek: Number(els.fields.dayOfWeek.value),
    weeks: els.fields.weeks.value.trim(),
    startSection: Number(els.fields.startSection.value),
    endSection: Number(els.fields.endSection.value),
    startTime: els.fields.startTime.value,
    endTime: els.fields.endTime.value
  };

  if (course.endSection < course.startSection) {
    showStatus('结束节不能早于开始节');
    return;
  }

  const existingIndex = state.courses.findIndex((item) => item.id === course.id);
  if (existingIndex >= 0) {
    state.courses[existingIndex] = course;
  } else {
    state.courses.push(course);
  }

  removeDeletedId(course.id);
  activeDay = course.dayOfWeek;
  persist();
  renderDayTabs();
  renderCourses();
  fillForm(course);
  showPage('schedulePage');
  showStatus('已保存到本地缓存');
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
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

function deleteCourse() {
  const id = els.fields.id.value;
  if (!id) {
    resetForm();
    return;
  }
  addDeletedId(id);
  state.courses = state.courses.filter((course) => course.id !== id);
  persist();
  renderCourses();
  resetForm(false);
  showPage('schedulePage');
  showStatus('已删除');
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
}

function renderWeek() {
  const start = startOfWeek(addDays(parseDate(state.semesterStart), (activeWeek - 1) * 7));
  const end = addDays(start, 6);
  els.todayText.textContent = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(new Date());
  els.weekLabel.textContent = `第 ${activeWeek} 周`;
  els.dateRange.textContent = `${formatDate(start)} - ${formatDate(end)}`;
}

function renderDayTabs() {
  els.dayTabs.innerHTML = '';
  DAY_NAMES.forEach((name, index) => {
    const day = index + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = day === activeDay ? 'active' : '';
    button.textContent = name.replace('星期', '周');
    button.addEventListener('click', () => {
      activeDay = day;
      renderDayTabs();
      renderCourses();
    });
    els.dayTabs.appendChild(button);
  });

  els.fields.dayOfWeek.innerHTML = DAY_NAMES.map((name, index) => (
    `<option value="${index + 1}">${name}</option>`
  )).join('');
}

function renderCourses() {
  const courses = state.courses
    .filter((course) => course.dayOfWeek === activeDay && includesWeek(course.weeks, activeWeek))
    .sort((a, b) => a.startSection - b.startSection || a.startTime.localeCompare(b.startTime));

  els.activeDayText.textContent = DAY_NAMES[activeDay - 1];
  els.courseCount.textContent = courses.length ? `${courses.length} 节课` : '今天没课';
  els.courseList.innerHTML = '';

  if (!courses.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '这一周这一天没有课程。';
    els.courseList.appendChild(empty);
    return;
  }

  courses.forEach((course) => {
    const node = els.template.content.firstElementChild.cloneNode(true);
    node.querySelector('.course-time').textContent = `${course.startTime} - ${course.endTime}`;
    node.querySelector('h3').textContent = course.name;
    node.querySelector('.course-meta').textContent = `${course.teacher} · 第 ${course.startSection}-${course.endSection} 节 · ${course.weeks} 周`;
    node.querySelector('.course-place').textContent = course.location;
    node.querySelector('.edit-button').addEventListener('click', () => fillForm(course));
    els.courseList.appendChild(node);
  });
}

function fillForm(course) {
  els.editorTitle.textContent = '编辑课程';
  els.fields.id.value = course.id;
  els.fields.name.value = course.name;
  els.fields.teacher.value = course.teacher;
  els.fields.location.value = course.location;
  els.fields.dayOfWeek.value = course.dayOfWeek;
  els.fields.weeks.value = course.weeks;
  els.fields.startSection.value = course.startSection;
  els.fields.endSection.value = course.endSection;
  els.fields.startTime.value = course.startTime;
  els.fields.endTime.value = course.endTime;
  els.deleteBtn.disabled = false;
  showPage('editPage');
}

function resetForm(openEditor = true) {
  els.editorTitle.textContent = '新课程';
  els.form.reset();
  els.fields.id.value = '';
  els.fields.dayOfWeek.value = activeDay;
  els.fields.weeks.value = String(activeWeek);
  els.fields.startSection.value = 1;
  els.fields.endSection.value = 2;
  els.fields.startTime.value = '08:00';
  els.fields.endTime.value = '09:40';
  els.deleteBtn.disabled = true;
  if (openEditor) showPage('editPage');
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach((page) => {
    page.classList.toggle('active', page.id === pageId);
  });
  els.pageTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.page === pageId);
  });
}

function changeWeek(delta) {
  activeWeek = Math.max(1, activeWeek + delta);
  renderWeek();
  renderCourses();
  resetForm(false);
}

function changeBackground(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localStorage.setItem(BG_KEY, reader.result);
    els.bgLayer.style.backgroundImage = `url("${reader.result}")`;
    showStatus('背景已保存到本地');
  });
  reader.readAsDataURL(file);
}

function resetRemoteUrl() {
  els.remoteUrl.value = DEFAULT_REMOTE_URL;
  localStorage.setItem(URL_KEY, DEFAULT_REMOTE_URL);
  showStatus('已恢复默认仓库地址');
}

function restoreBackground() {
  const bg = localStorage.getItem(BG_KEY);
  if (bg) els.bgLayer.style.backgroundImage = `url("${bg}")`;
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

function includesWeek(value, week) {
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .some((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        return week >= start && week <= end;
      }
      return Number(part) === week;
    });
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
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

function showStatus(message) {
  els.loadBtn.textContent = message;
  if (els.syncHint) els.syncHint.textContent = message;
  window.setTimeout(() => {
    els.loadBtn.textContent = '读取并合并';
    if (els.syncHint) els.syncHint.textContent = '读取 GitHub 后会缓存到本地；你编辑过的课程会优先保留。';
  }, 1800);
}

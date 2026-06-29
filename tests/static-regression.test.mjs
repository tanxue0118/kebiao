import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hash = (path) => createHash('sha256').update(read(path)).digest('hex');

const rootIndex = read('index.html');
const rootApp = read('app.js');
const rootStyles = read('styles.css');
const rootOverrides = read('overrides.css');
const rootSchedule = JSON.parse(read('schedule.json'));
const apkIndex = read('apk-build/assets/www/index.html');
const apkApp = read('apk-build/assets/www/app.js');
const apkStyles = read('apk-build/assets/www/styles.css');
const apkOverrides = read('apk-build/assets/www/overrides.css');
const apkSchedule = JSON.parse(read('apk-build/assets/www/schedule.json'));
const scheduleStore = read('apk-build/src/com/tanxue/kebiao/ScheduleStore.java');
const androidManifest = read('apk-build/AndroidManifest.xml');
const mainActivity = read('apk-build/src/com/tanxue/kebiao/MainActivity.java');

for (const file of ['index.html', 'app.js', 'styles.css', 'overrides.css', 'schedule.json']) {
  assert.equal(hash(file), hash(`apk-build/assets/www/${file}`), `${file} must match APK asset copy`);
}

for (const html of [rootIndex, apkIndex]) {
  for (const id of [
    'searchBtn',
    'activeScheduleName',
    'themeModeGroup',
    'exportImageBtn',
    'exportIcsBtn',
    'importIcsInput',
    'shareCodeBtn',
    'importShareCodeBtn',
    'scheduleList',
    'createScheduleBtn'
  ]) {
    assert.match(html, new RegExp(`id="${id}"`), `HTML missing #${id}`);
  }
}

for (const js of [rootApp, apkApp]) {
  for (const token of [
    "const MULTI_KEY = 'kebiao:multi:v1'",
    "const ACTIVE_KEY = 'kebiao:active:v1'",
    'const THEME_MODES',
    'function initMultiSchedule',
    'function openSearch',
    'function exportScheduleImage',
    'function exportScheduleIcs',
    'function importScheduleIcs',
    'function openShareCodeExport',
    'function openShareCodeImport',
    'function loadQRCodeLib',
    'function loadHtml5QrcodeLib'
  ]) {
    assert.ok(js.includes(token), `app.js missing ${token}`);
  }
  assert.ok(!js.includes('DAILY_POEM_URL'), 'competition build should not keep daily poem network fetch');
  assert.ok(!js.includes('schedule.json'), 'app.js should not fetch or reference bundled schedule.json');
  assert.ok(!js.includes(':has('), 'app.js should avoid :has() selectors for older APK WebView compatibility');
  assert.ok(!js.includes('CSS.escape'), 'app.js should not require CSS.escape in older APK WebViews');
  assert.ok(js.includes('function scheduleStartupTasks'), 'startup work should be deferred off the first paint');
  assert.ok(js.includes('function requestHolidayRefreshSoon'), 'holiday refresh should be scheduled through an idle helper');
  assert.match(js, /function requestHolidayRefreshSoon\(\) \{[\s\S]*?whenIdle\(\(\) => \{[\s\S]*?maybeRefreshAutoHolidays\(\);[\s\S]*?\}/, 'holiday refresh should wait for idle time instead of startup');
  assert.ok(js.includes('function fetchWithTimeout'), 'holiday fetch should have a timeout so slow networks fall back quickly');
  const initBody = js.slice(js.indexOf('function init()'), js.indexOf('function scheduleStartupTasks'));
  assert.ok(!initBody.includes('maybeRefreshAutoHolidays();'), 'init should not trigger holiday refresh synchronously');
  assert.ok(!initBody.includes('renderTimetable();'), 'init should not render the full timetable before the first paint');
  assert.match(js, /const fallbackSchedule = \{[\s\S]*?courses:\s*\[\][\s\S]*?\};/, 'fallbackSchedule must be empty');
}

const shareBlock = rootApp.slice(
  rootApp.indexOf('/* ===== Kaomoji share code'),
  rootApp.indexOf('function openShareCodeExport')
);
assert.ok(shareBlock.includes('function packSchedule'), 'share-code packer block should be extractable');

const shareContext = {
  TextEncoder,
  TextDecoder,
  Date,
  Uint8Array,
  Math,
  Set,
  String,
  parseInt,
  Error
};
vm.runInNewContext(`${shareBlock}
globalThis.__roundTrip = (() => {
  const longName = '课程'.repeat(180);
  const course = {
    name: longName,
    teacher: 'Teacher A',
    location: 'Room 101',
    dayOfWeek: 3,
    weeks: '1-3,5',
    weekParity: 'odd',
    startSection: 1,
    endSection: 2,
    customTimeEnabled: true,
    startTime: '09:10',
    endTime: '10:40'
  };
  return unpackSchedule(packSchedule([course], '2026-09-07', 18));
})();`, shareContext);

assert.equal(shareContext.__roundTrip.semesterStart, '2026-09-07', 'share code should keep semester start');
assert.equal(shareContext.__roundTrip.semesterWeeks, 18, 'share code should keep semester weeks');
assert.equal(shareContext.__roundTrip.courses[0].name, '课程'.repeat(180), 'share code should round-trip long UTF-8 names');
assert.equal(shareContext.__roundTrip.courses[0].teacher, 'Teacher A', 'long UTF-8 names must not corrupt following fields');
assert.equal(shareContext.__roundTrip.courses[0].location, 'Room 101', 'long UTF-8 names must not corrupt location');
assert.equal(shareContext.__roundTrip.courses[0].dayOfWeek, 3, 'share code should keep weekday');
assert.equal(shareContext.__roundTrip.courses[0].startSection, 1, 'share code should keep start section');
assert.equal(shareContext.__roundTrip.courses[0].endSection, 2, 'share code should keep end section');

for (const css of [rootStyles + rootOverrides, apkStyles + apkOverrides]) {
  assert.ok(!/@import\s+url\(["']?https?:/i.test(css), 'CSS must not block first paint on remote @import fonts');
  assert.ok(!css.includes('fonts.googleapis.com'), 'CSS must not load Google Fonts during startup');
  assert.ok(!css.includes('[data-start'), 'CSS should not carry the old data-start grid mapping table');
  assert.ok(!css.includes('[data-end'), 'CSS should not carry the old data-end grid mapping table');
  for (const selector of [
    'html[data-theme="dark"]',
    '.search-backdrop',
    '.sharecode-backdrop',
    '.schedule-list',
    '.schedule-list-item'
  ]) {
    assert.ok(css.includes(selector), `CSS missing ${selector}`);
  }
}

for (const schedule of [rootSchedule, apkSchedule]) {
  assert.ok(Array.isArray(schedule.courses), 'schedule.courses must be an array');
  assert.equal(schedule.courses.length, 0, 'bundled schedule must not include courses');
}

assert.ok(!scheduleStore.includes('readAssetText(context, "www/schedule.json")'), 'widgets must not fall back to bundled schedule.json');
assert.match(scheduleStore, /EMPTY_SCHEDULE_JSON/, 'ScheduleStore should expose an empty fallback schedule');

assert.ok(androidManifest.includes('android:hardwareAccelerated="true"'), 'APK should explicitly enable hardware acceleration');
for (const token of [
  'WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED',
  'webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)',
  'settings.setOffscreenPreRaster(true)',
  'webView.setRendererPriorityPolicy(WebView.RENDERER_PRIORITY_IMPORTANT, true)'
]) {
  assert.ok(mainActivity.includes(token), `MainActivity missing acceleration setting: ${token}`);
}
for (const css of [rootStyles + rootOverrides, apkStyles + apkOverrides]) {
  assert.ok(css.includes('transform: translateZ(0)'), 'CSS missing compositor hint: transform: translateZ(0)');
  assert.ok(css.includes('will-change: transform'), 'CSS missing compositor hint: will-change: transform');
  assert.match(css, /contain:\s*layout(?:\s+style)?\s+paint/, 'CSS missing layout/paint containment for accelerated layers');
}

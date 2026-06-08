package com.tanxue.kebiao;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

public class WeekWidgetProvider extends AppWidgetProvider {
    private static final int[] DAY_IDS = {
            R.id.week_day_1,
            R.id.week_day_2,
            R.id.week_day_3,
            R.id.week_day_4,
            R.id.week_day_5,
            R.id.week_day_6,
            R.id.week_day_7
    };
    private static final String[] DAY_NAMES = {
            "\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d", "\u5468\u65e5"
    };

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateWidget(Context context, AppWidgetManager manager, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_week_courses);
        WeekData data = WeekData.load(context);
        views.setTextViewText(R.id.week_widget_title, "\u672c\u5468\u8bfe\u8868");
        views.setTextViewText(R.id.week_widget_subtitle, data.subtitle);
        for (int i = 0; i < DAY_IDS.length; i++) {
            views.setViewVisibility(DAY_IDS[i], data.dayLines[i].length() == 0 ? View.GONE : View.VISIBLE);
            views.setTextViewText(DAY_IDS[i], data.dayLines[i]);
        }

        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                1,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);
        manager.updateAppWidget(widgetId, views);
    }

    private static class WeekData {
        final String subtitle;
        final String[] dayLines;

        WeekData(String subtitle, String[] dayLines) {
            this.subtitle = subtitle;
            this.dayLines = dayLines;
        }

        static WeekData load(Context context) {
            String[] lines = new String[7];
            for (int i = 0; i < lines.length; i++) {
                lines[i] = DAY_NAMES[i] + "  " + "\u65e0\u8bfe";
            }
            try {
                JSONObject schedule = new JSONObject(readAssetText(context, "www/schedule.json"));
                JSONObject config = schedule.optJSONObject("config");
                String startDate = config != null
                        ? config.optString("semesterStartDate", "2026-03-02")
                        : "2026-03-02";
                int week = getCurrentWeek(startDate);
                Map<Integer, TimeSlot> slots = readTimeSlots(schedule.optJSONArray("timeSlots"));
                Calendar now = Calendar.getInstance();
                int todayDay = getTodayDay(now);
                Map<Integer, List<CourseLine>> byDay = readWeekCourses(schedule.optJSONArray("courses"), slots, week, todayDay, now);
                for (int day = 1; day <= 7; day++) {
                    List<CourseLine> courses = byDay.get(day);
                    if (courses == null || courses.isEmpty()) {
                        lines[day - 1] = "";
                    } else {
                        StringBuilder builder = new StringBuilder(DAY_NAMES[day - 1]);
                        for (CourseLine course : courses) {
                            builder.append("\n").append(course.text);
                        }
                        lines[day - 1] = builder.toString();
                    }
                }
                return new WeekData("\u7b2c" + week + "\u5468\u5269\u4f59\u8bfe\u7a0b \u00b7 " + new SimpleDateFormat("M\u6708d\u65e5", Locale.CHINA).format(new Date()), lines);
            } catch (Exception e) {
                for (int i = 0; i < lines.length; i++) {
                    lines[i] = DAY_NAMES[i] + "  " + "\u70b9\u5f00\u5e94\u7528\u67e5\u770b";
                }
                return new WeekData("\u6682\u65f6\u65e0\u6cd5\u8bfb\u53d6\u8bfe\u8868", lines);
            }
        }

        private static Map<Integer, List<CourseLine>> readWeekCourses(JSONArray courses, Map<Integer, TimeSlot> slots, int week, int todayDay, Calendar now) throws Exception {
            Map<Integer, List<CourseLine>> result = new HashMap<Integer, List<CourseLine>>();
            if (courses == null) return result;
            for (int i = 0; i < courses.length(); i++) {
                JSONObject item = courses.getJSONObject(i);
                if (!containsWeek(item, week)) continue;
                int day = item.optInt("day", item.optInt("dayOfWeek", 1));
                int startSection = item.optInt("startSection", item.optInt("startPeriod", 0));
                int endSection = item.optInt("endSection", item.optInt("endPeriod", startSection));
                String startTime = item.optString("customStartTime", item.optString("startTime", ""));
                String endTime = item.optString("customEndTime", item.optString("endTime", ""));
                if (startTime.length() == 0 && slots.containsKey(startSection)) startTime = slots.get(startSection).start;
                if (endTime.length() == 0 && slots.containsKey(endSection)) endTime = slots.get(endSection).end;
                if (isPastCourse(day, endTime, todayDay, now)) continue;
                String name = item.optString("name", "\u672a\u547d\u540d\u8bfe\u7a0b");
                String text = formatSection(startSection, endSection) + "  " + name + (startTime.length() > 0 ? " \u00b7 " + formatTime(startTime, endTime) : "");
                if (!result.containsKey(day)) result.put(day, new ArrayList<CourseLine>());
                result.get(day).add(new CourseLine(startSection, startTime, text));
            }
            for (List<CourseLine> dayCourses : result.values()) {
                Collections.sort(dayCourses, new Comparator<CourseLine>() {
                    @Override
                    public int compare(CourseLine left, CourseLine right) {
                        if (left.section != right.section) return left.section - right.section;
                        return left.time.compareTo(right.time);
                    }
                });
            }
            return result;
        }

        private static boolean containsWeek(JSONObject item, int week) {
            JSONArray weeks = item.optJSONArray("weeks");
            if (weeks != null) {
                for (int i = 0; i < weeks.length(); i++) {
                    if (weeks.optInt(i, -1) == week) return true;
                }
                return false;
            }
            String value = item.optString("weeks", "");
            if (value.length() == 0) return false;
            String[] parts = value.split(",");
            for (String raw : parts) {
                String part = raw.trim();
                if (part.indexOf('-') > 0) {
                    String[] range = part.split("-");
                    if (range.length == 2 && toInt(range[0]) <= week && week <= toInt(range[1])) return true;
                } else if (toInt(part) == week) {
                    return true;
                }
            }
            return false;
        }

        private static Map<Integer, TimeSlot> readTimeSlots(JSONArray slots) throws Exception {
            Map<Integer, TimeSlot> result = new HashMap<Integer, TimeSlot>();
            if (slots == null) return result;
            for (int i = 0; i < slots.length(); i++) {
                JSONObject slot = slots.getJSONObject(i);
                result.put(slot.optInt("number", i + 1), new TimeSlot(slot.optString("startTime", ""), slot.optString("endTime", "")));
            }
            return result;
        }

        private static int getCurrentWeek(String startDate) throws Exception {
            Date start = new SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(startDate);
            Calendar startCal = Calendar.getInstance();
            startCal.setTime(start);
            zeroTime(startCal);
            Calendar today = Calendar.getInstance();
            zeroTime(today);
            long diff = today.getTimeInMillis() - startCal.getTimeInMillis();
            return Math.max(1, (int) (diff / (7L * 24L * 60L * 60L * 1000L)) + 1);
        }

        private static int getTodayDay(Calendar calendar) {
            int androidDay = calendar.get(Calendar.DAY_OF_WEEK);
            return androidDay == Calendar.SUNDAY ? 7 : androidDay - 1;
        }

        private static boolean isPastCourse(int day, String endTime, int todayDay, Calendar now) {
            if (day < todayDay) return true;
            if (day > todayDay || endTime.length() == 0) return false;
            int endMinutes = timeToMinutes(endTime);
            if (endMinutes < 0) return false;
            int nowMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE);
            return endMinutes < nowMinutes;
        }

        private static void zeroTime(Calendar calendar) {
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
        }

        private static String formatTime(String start, String end) {
            if (start.length() == 0) return "";
            return end.length() == 0 ? start : start + "-" + end;
        }

        private static String formatSection(int startSection, int endSection) {
            if (startSection <= 0) return "\u81ea\u5b9a\u4e49";
            if (endSection <= startSection) return "\u7b2c" + startSection + "\u8282";
            return "\u7b2c" + startSection + "-" + endSection + "\u8282";
        }

        private static int timeToMinutes(String time) {
            String[] parts = time.split(":");
            if (parts.length != 2) return -1;
            int hour = toInt(parts[0]);
            int minute = toInt(parts[1]);
            if (hour < 0 || minute < 0) return -1;
            return hour * 60 + minute;
        }

        private static int toInt(String value) {
            try {
                return Integer.parseInt(value.trim());
            } catch (Exception e) {
                return -1;
            }
        }

        private static String readAssetText(Context context, String path) throws Exception {
            InputStream input = context.getAssets().open(path);
            try {
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                byte[] buffer = new byte[4096];
                int read;
                while ((read = input.read(buffer)) != -1) {
                    output.write(buffer, 0, read);
                }
                return new String(output.toByteArray(), StandardCharsets.UTF_8);
            } finally {
                input.close();
            }
        }
    }

    private static class TimeSlot {
        final String start;
        final String end;

        TimeSlot(String start, String end) {
            this.start = start;
            this.end = end;
        }
    }

    private static class CourseLine {
        final int section;
        final String time;
        final String text;

        CourseLine(int section, String time, String text) {
            this.section = section;
            this.time = time;
            this.text = text;
        }
    }
}

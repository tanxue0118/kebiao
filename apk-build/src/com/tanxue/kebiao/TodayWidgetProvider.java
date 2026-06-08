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

public class TodayWidgetProvider extends AppWidgetProvider {
    private static final int[] COURSE_IDS = {
            R.id.widget_course_1,
            R.id.widget_course_2,
            R.id.widget_course_3,
            R.id.widget_course_4
    };

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId);
        }
    }

    private void updateWidget(Context context, AppWidgetManager manager, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_today_courses);
        TodayData data = TodayData.load(context);

        views.setTextViewText(R.id.widget_title, "\u4eca\u65e5\u8bfe\u7a0b");
        views.setTextViewText(R.id.widget_subtitle, data.subtitle);
        for (int id : COURSE_IDS) {
            views.setViewVisibility(id, View.GONE);
        }

        if (data.courses.isEmpty()) {
            views.setViewVisibility(R.id.widget_course_1, View.VISIBLE);
            views.setTextViewText(R.id.widget_course_1, data.emptyText);
        } else {
            int count = Math.min(COURSE_IDS.length, data.courses.size());
            for (int i = 0; i < count; i++) {
                views.setViewVisibility(COURSE_IDS[i], View.VISIBLE);
                views.setTextViewText(COURSE_IDS[i], data.courses.get(i).summary);
            }
            if (data.courses.size() > COURSE_IDS.length) {
                views.setTextViewText(COURSE_IDS[COURSE_IDS.length - 1], "\u8fd8\u6709 " + (data.courses.size() - COURSE_IDS.length + 1) + " \u95e8\u8bfe");
            }
        }

        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);
        manager.updateAppWidget(widgetId, views);
    }

    private static class TodayData {
        final String subtitle;
        final String emptyText;
        final List<CourseLine> courses;

        TodayData(String subtitle, String emptyText, List<CourseLine> courses) {
            this.subtitle = subtitle;
            this.emptyText = emptyText;
            this.courses = courses;
        }

        static TodayData load(Context context) {
            try {
                JSONObject schedule = new JSONObject(readAssetText(context, "www/schedule.json"));
                JSONObject config = schedule.optJSONObject("config");
                String startDate = config != null
                        ? config.optString("semesterStartDate", "2026-03-02")
                        : "2026-03-02";
                int week = getCurrentWeek(startDate);
                int day = getTodayDay();
                Map<Integer, TimeSlot> slots = readTimeSlots(schedule.optJSONArray("timeSlots"));
                List<CourseLine> lines = readCourses(schedule.optJSONArray("courses"), slots, week, day);
                String weekday = new SimpleDateFormat("M\u6708d\u65e5 EEEE", Locale.CHINA).format(new Date());
                return new TodayData(weekday + " \u00b7 \u7b2c" + week + "\u5468", "\u4eca\u5929\u6ca1\u6709\u8bfe\u7a0b", lines);
            } catch (Exception e) {
                return new TodayData("\u70b9\u5f00\u5e94\u7528\u67e5\u770b\u8bfe\u8868", "\u6682\u65f6\u65e0\u6cd5\u8bfb\u53d6\u8bfe\u7a0b", new ArrayList<CourseLine>());
            }
        }

        private static List<CourseLine> readCourses(JSONArray courses, Map<Integer, TimeSlot> slots, int week, int day) throws Exception {
            List<CourseLine> result = new ArrayList<CourseLine>();
            if (courses == null) return result;
            for (int i = 0; i < courses.length(); i++) {
                JSONObject item = courses.getJSONObject(i);
                int itemDay = item.optInt("day", item.optInt("dayOfWeek", 1));
                if (itemDay != day || !containsWeek(item.optJSONArray("weeks"), week)) continue;

                int startSection = item.optInt("startSection", item.optInt("startPeriod", 0));
                int endSection = item.optInt("endSection", item.optInt("endPeriod", startSection));
                String startTime = item.optString("customStartTime", item.optString("startTime", ""));
                String endTime = item.optString("customEndTime", item.optString("endTime", ""));
                if (startTime.length() == 0 && slots.containsKey(startSection)) startTime = slots.get(startSection).start;
                if (endTime.length() == 0 && slots.containsKey(endSection)) endTime = slots.get(endSection).end;

                String name = item.optString("name", "\u672a\u547d\u540d\u8bfe\u7a0b");
                String place = item.optString("position", item.optString("location", ""));
                String time = formatTime(startTime, endTime);
                String summary = time + "  " + name + (place.length() > 0 ? " \u00b7 " + place : "");
                result.add(new CourseLine(startSection, startTime, summary));
            }
            Collections.sort(result, new Comparator<CourseLine>() {
                @Override
                public int compare(CourseLine left, CourseLine right) {
                    if (left.section != right.section) return left.section - right.section;
                    return left.time.compareTo(right.time);
                }
            });
            return result;
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

        private static boolean containsWeek(JSONArray weeks, int week) {
            if (weeks == null) return false;
            for (int i = 0; i < weeks.length(); i++) {
                if (weeks.optInt(i, -1) == week) return true;
            }
            return false;
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

        private static int getTodayDay() {
            int androidDay = Calendar.getInstance().get(Calendar.DAY_OF_WEEK);
            return androidDay == Calendar.SUNDAY ? 7 : androidDay - 1;
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
        final String summary;

        CourseLine(int section, String time, String summary) {
            this.section = section;
            this.time = time;
            this.summary = summary;
        }
    }
}

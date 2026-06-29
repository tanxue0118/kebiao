package com.tanxue.kebiao;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

public final class ScheduleStore {
    private static final String PREFS_NAME = "schedule_widget_cache";
    private static final String SCHEDULE_KEY = "schedule_json";
    private static final String EMPTY_SCHEDULE_JSON = "{"
            + "\"semesterStart\":\"\","
            + "\"semesterWeeks\":16,"
            + "\"timeSlots\":["
            + "{\"number\":1,\"startTime\":\"08:00\",\"endTime\":\"08:45\"},"
            + "{\"number\":2,\"startTime\":\"08:55\",\"endTime\":\"09:40\"},"
            + "{\"number\":3,\"startTime\":\"10:00\",\"endTime\":\"10:45\"},"
            + "{\"number\":4,\"startTime\":\"10:55\",\"endTime\":\"11:40\"},"
            + "{\"number\":5,\"startTime\":\"14:30\",\"endTime\":\"15:15\"},"
            + "{\"number\":6,\"startTime\":\"15:25\",\"endTime\":\"16:10\"},"
            + "{\"number\":7,\"startTime\":\"16:20\",\"endTime\":\"17:05\"},"
            + "{\"number\":8,\"startTime\":\"17:15\",\"endTime\":\"18:00\"},"
            + "{\"number\":9,\"startTime\":\"18:40\",\"endTime\":\"19:25\"},"
            + "{\"number\":10,\"startTime\":\"19:35\",\"endTime\":\"20:20\"},"
            + "{\"number\":11,\"startTime\":\"20:30\",\"endTime\":\"21:15\"},"
            + "{\"number\":12,\"startTime\":\"21:25\",\"endTime\":\"22:10\"}"
            + "],"
            + "\"config\":{\"semesterStartDate\":\"\",\"semesterTotalWeeks\":16},"
            + "\"courses\":[]"
            + "}";

    private ScheduleStore() {
    }

    public static void save(Context context, String json) {
        context.getApplicationContext()
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(SCHEDULE_KEY, json)
                .apply();
    }

    public static String read(Context context) throws Exception {
        SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String cached = prefs.getString(SCHEDULE_KEY, "");
        if (cached != null && cached.trim().length() > 0) return cached;
        return EMPTY_SCHEDULE_JSON;
    }

    public static void refreshWidgets(Context context) {
        refreshProvider(context, CompactTodayWidgetProvider.class);
        refreshProvider(context, TodayWidgetProvider.class);
        refreshProvider(context, LargeTodayWidgetProvider.class);
        refreshProvider(context, WeekWidgetProvider.class);
    }

    private static void refreshProvider(Context context, Class<?> providerClass) {
        Context appContext = context.getApplicationContext();
        AppWidgetManager manager = AppWidgetManager.getInstance(appContext);
        ComponentName componentName = new ComponentName(appContext, providerClass);
        int[] ids = manager.getAppWidgetIds(componentName);
        if (ids == null || ids.length == 0) return;

        Intent intent = new Intent(appContext, providerClass);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        appContext.sendBroadcast(intent);
    }

}

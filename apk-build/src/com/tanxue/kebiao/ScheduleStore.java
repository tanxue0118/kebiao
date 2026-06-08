package com.tanxue.kebiao;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public final class ScheduleStore {
    private static final String PREFS_NAME = "schedule_widget_cache";
    private static final String SCHEDULE_KEY = "schedule_json";

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
        return readAssetText(context, "www/schedule.json");
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

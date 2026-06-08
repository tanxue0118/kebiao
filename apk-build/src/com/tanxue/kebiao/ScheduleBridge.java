package com.tanxue.kebiao;

import android.content.Context;
import android.webkit.JavascriptInterface;
import org.json.JSONObject;

public class ScheduleBridge {
    private final Context context;

    ScheduleBridge(Context context) {
        this.context = context.getApplicationContext();
    }

    @JavascriptInterface
    public void saveSchedule(String json) {
        try {
            new JSONObject(json);
            ScheduleStore.save(context, json);
            ScheduleStore.refreshWidgets(context);
        } catch (Exception ignored) {
        }
    }
}

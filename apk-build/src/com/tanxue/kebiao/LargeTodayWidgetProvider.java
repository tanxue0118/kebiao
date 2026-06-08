package com.tanxue.kebiao;

public class LargeTodayWidgetProvider extends TodayWidgetProvider {
    private static final int[] LARGE_COURSE_IDS = {
            R.id.widget_course_1,
            R.id.widget_course_2,
            R.id.widget_course_3,
            R.id.widget_course_4,
            R.id.widget_course_5,
            R.id.widget_course_6
    };

    @Override
    protected int getLayoutId() {
        return R.layout.widget_today_courses_large;
    }

    @Override
    protected int[] getCourseIds() {
        return LARGE_COURSE_IDS;
    }
}

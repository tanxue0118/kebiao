package com.tanxue.kebiao;

public class CompactTodayWidgetProvider extends TodayWidgetProvider {
    private static final int[] COMPACT_COURSE_IDS = {
            R.id.widget_course_1,
            R.id.widget_course_2
    };

    @Override
    protected int getLayoutId() {
        return R.layout.widget_today_courses_compact;
    }

    @Override
    protected int[] getCourseIds() {
        return COMPACT_COURSE_IDS;
    }

    @Override
    protected String getCourseText(CourseLine course) {
        return course.compactSummary;
    }
}

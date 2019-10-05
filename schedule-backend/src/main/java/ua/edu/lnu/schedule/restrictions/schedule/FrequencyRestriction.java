package ua.edu.lnu.schedule.restrictions.schedule;

import ua.edu.lnu.schedule.models.Class;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

public class FrequencyRestriction implements IScheduleRestriction {
    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        return 0;
    }

    @Override
    public boolean checkResult(int result) {
        return false;
    }

    @Override
    public String getPassedMessage() {
        return null;
    }

    @Override
    public String getFailedMessage() {
        return null;
    }
}

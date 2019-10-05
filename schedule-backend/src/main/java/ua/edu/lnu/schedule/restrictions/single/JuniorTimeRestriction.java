package ua.edu.lnu.schedule.restrictions.single;

import ua.edu.lnu.schedule.infrastructure.CalendarHelper;
import ua.edu.lnu.schedule.models.Class;

import java.util.List;

public class JuniorTimeRestriction implements ISingleClassRestriction {
    private int middleCourse = 3;
    private int maxNumber = 4;

    @Override
    public int check(List<Class> classes) {
        int result = 0;
        for (Class c : classes) {
            int course = CalendarHelper.CurrentYear() - c.getGroups().iterator().next().getYear();
            if (course < middleCourse && c.getNumber() > maxNumber) {
                result++;
            }
        }

        return result;
    }

    @Override
    public boolean checkResult(int result) {
        return result == 0;
    }

    @Override
    public String getPassedMessage() {
        return "Пари молдших курсів проводяться в першу зміну.";
    }

    @Override
    public String getFailedMessage() {
        return "Пари молдших курсів проводяться в другу зміну.";
    }
}

package ua.edu.lnu.schedule.restrictions.schedule;

public class LecturerWindowCountRestriction extends WindowCountRestriction {
    @Override
    public String getPassedMessage() {
        return "Немає вікон між парами для викладачів.";
    }

    @Override
    public String getFailedMessage() {
        return "Є вікна між парами для викладачів.";
    }
}

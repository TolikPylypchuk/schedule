package ua.edu.lnu.schedule.restrictions.schedule;

public class GroupWindowCountRestriction extends WindowCountRestriction {
    @Override
    public String getPassedMessage() {
        return "Немає вікон між парами для груп.";
    }

    @Override
    public String getFailedMessage() {
        return "Є вікна між парами для груп.";
    }
}

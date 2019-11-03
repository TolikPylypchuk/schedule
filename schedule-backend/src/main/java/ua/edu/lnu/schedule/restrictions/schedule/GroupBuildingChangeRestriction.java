package ua.edu.lnu.schedule.restrictions.schedule;

public class GroupBuildingChangeRestriction extends BuildingChangeRestriction {
    @Override
    public String getPassedMessage() {
        return "Кількість переходів між корпусами для груп не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість переходів між корпусами для груп перевищує дозволену.";
    }
}

package ua.edu.lnu.schedule.restrictions.schedule;

public class LecturerBuildingChangeRestriction extends BuildingChangeRestriction {
    @Override
    public String getPassedMessage() {
        return "Кількість переходів між корпусами для виклачів не перевищує дозволену.";
    }

    @Override
    public String getFailedMessage() {
        return "Кількість переходів між корпусами для викладачів перевищує дозволену.";
    }
}

package ua.edu.lnu.schedule.restrictions;

public interface IRestriction {
    boolean checkResult(int result);
    String getPassedMessage();
    String getFailedMessage();
}

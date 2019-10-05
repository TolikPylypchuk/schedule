package ua.edu.lnu.schedule.restrictions;

public class RestrictionCheckResult {
    private String restriction;
    private boolean checkPassed;
    private String message;

    public RestrictionCheckResult(String restriction, boolean checkPassed, String message) {
        this.restriction = restriction;
        this.checkPassed = checkPassed;
        this.message = message;
    }

    public String getRestriction() {
        return restriction;
    }

    public boolean isCheckPassed() {
        return checkPassed;
    }

    public String getMessage() {
        return message;
    }
}

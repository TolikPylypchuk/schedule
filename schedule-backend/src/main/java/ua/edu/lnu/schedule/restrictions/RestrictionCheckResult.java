package ua.edu.lnu.schedule.restrictions;

public class RestrictionCheckResult {
    private String restriction;
    private boolean checkPassed;
    private String message;
    private int result;
//
//    public RestrictionCheckResult(String restriction, boolean checkPassed, String message) {
//        this.restriction = restriction;
//        this.checkPassed = checkPassed;
//        this.message = message;
//    }

    public RestrictionCheckResult(String restriction, boolean checkPassed, String message, int result) {
        this.restriction = restriction;
        this.checkPassed = checkPassed;
        this.message = message;
        this.result = result;
    }

    public int getResult() {
        return result;
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

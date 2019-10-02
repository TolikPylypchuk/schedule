package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum LectureType {
    GROUP(0),
    DEPARTMENT(1),
    COURSE(2);

    private final int number;

    LectureType(int number) {
        this.number = number;
    }

    @JsonValue
    public int getNumber() {
        return number;
    }

    @JsonCreator
    public static LectureType fromNumber(int number) {
        return number == 0
                ? GROUP
                : number == 1
                ? DEPARTMENT
                : number == 2
                ? COURSE
                : null;
    }
}

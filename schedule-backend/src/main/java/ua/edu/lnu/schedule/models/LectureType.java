package ua.edu.lnu.schedule.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum LectureType {
    GROUP(1),
    DEPARTMENT(2),
    COURSE(3);

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
        return number == 1
                ? GROUP
                : number == 2
                ? DEPARTMENT
                : number == 3
                ? COURSE
                : null;
    }
}

package ua.edu.lnu.schedule.restrictions.schedule;

import javafx.util.Pair;
import ua.edu.lnu.schedule.models.Class;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class UniformityRestriction implements IScheduleRestriction {

    @Override
    public int check(Map<DayOfWeek, List<Class>> schedule) {
        int result = 0;
        List<Pair<Integer, Integer>> startsAndEnds = schedule.values().stream().map(classes -> {
            if (classes.size() > 0) {
                return new Pair<>(classes.get(0).getNumber(), classes.get(classes.size() - 1).getNumber());
            }

            return new Pair<>(0, 0);
        }).collect(Collectors.toList());

        for (int i = 0; i < startsAndEnds.size() - 1; i++) {
            Pair<Integer, Integer> current = startsAndEnds.get(i);
            Pair<Integer, Integer> next = startsAndEnds.get(i + 1);
            if(Math.abs(current.getKey() - next.getKey()) > 1) {
                result++;
            }

            if(Math.abs(current.getValue() - next.getValue()) > 1) {
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
        return "Час проведдення пар рівномірний протягом тижня.";
    }

    @Override
    public String getFailedMessage() {
        return "Час проведення пар нерівномірний протягом тижня.";
    }
}
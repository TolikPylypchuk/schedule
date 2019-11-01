import { Component, OnInit } from "@angular/core";
import { CheckResult } from "../../../../common/models/models";
import { ScheduleCheckResult } from "../../../models/models";

@Component({
	selector: "schedule-editor-analyser",
    templateUrl: "./analyser.component.html"
})

export class AnalyserComponent {
    checkResults: CheckResult[] = [];

    combinedResult(): ScheduleCheckResult {
        const passed = this.checkResults.filter(result => result.key.checkPassed).length;
        const total = this.checkResults.length;

        return passed === total
            ? ScheduleCheckResult.GOOD
            : total / passed < 2
                ? ScheduleCheckResult.BAD
                : ScheduleCheckResult.UGLY;
    }
}

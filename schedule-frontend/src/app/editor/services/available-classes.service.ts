import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Class } from "../../common/models/models";
import { ClassService } from "../../common/services/services";
import { getCurrentYear, getCurrentSemester, compareClassesByShortName } from "../../common/models/functions";

@Injectable()
export class AvailableClassesService {
    classes: BehaviorSubject<Class[]> = new BehaviorSubject<Class[]>([]);

    constructor(private classService: ClassService) {
    }

    setAvailableClasses(facultyId: number): void {
        this.classService.getGeneratedClassesByFacultyAndYearAndSemester(
            facultyId,
            getCurrentYear(),
            getCurrentSemester()
        ).subscribe((classes: Class[]) => {
            this.updateAvailableClasses(classes.sort(compareClassesByShortName));
        });
    }

    updateAvailableClasses(classes: Class[]): void {
        this.classes.next(classes);
    }
}

import { Injectable } from "@angular/core";
import { ViewToggle } from "../components/helpers";
import { Observable } from "rxjs/Observable";
import * as models from "../../common/models/models";
import { ClassService, UserService, WishService, GroupService } from "../../common/services/services";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
    getCurrentYear,
    getCurrentSemester,
    compareUsersByName,
    getUserInitials,
    getCurrentGroupName
} from "../../common/models/functions";
import { View } from "../models/models";

@Injectable()
export class ViewService {
    private lecturerWishes: Map<number, models.Wish[]> = new Map();
    private viewObjects: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private setViewClasses: (objrctId: number) => void;
    private currentView: View;

    view: BehaviorSubject<View> = new BehaviorSubject<View>(new View());
    currentClasses: Map<number, models.Class[]> = new Map();
    updatedViewClasses: BehaviorSubject<Map<number, models.Class[]>> = new BehaviorSubject<Map<number, models.Class[]>>(new Map());

    wishes: Subject<Map<number, models.Wish[]>> = new Subject<Map<number, models.Wish[]>>();

    constructor(private classService: ClassService,
        private userService: UserService,
        private wishService: WishService,
        private groupService: GroupService) {
    }

    setView(toggle: ViewToggle, facultyId: number) {
        if (this.view.observers.length > 0) {
            this.currentClasses = new Map();
            this.view.next(new View());
            this.viewObjects.next([]);
            this.updatedViewClasses.next(new Map());
        }

        let getObjectName: (obj: any) => string;

        switch (toggle) {
            case ViewToggle.LECTURERS:
                getObjectName = getUserInitials;
                this.setLecturers(facultyId);
                this.setViewClasses = this.setLecturerClasses;
                this.viewObjects.subscribe((lecturers: models.User[]) => {
                    for (const lecturer of lecturers) {
                        this.setLecturerWishes(lecturer.id);
                    }
                });
                break;
            case ViewToggle.GROUPS:
                getObjectName = getCurrentGroupName;
                this.setGroups(facultyId);
                this.setViewClasses = this.setGroupClasses;
                break;
        }

        this.viewObjects.subscribe(objects => {
            for (const obj of objects) {
                this.setViewClasses(obj.id);
            }

            this.currentView = Object.assign(this.view.value, {
                toggle: toggle,
                objects: objects,
                getObjectName: getObjectName
            });

            this.updateView();
        });

        // this.updatedViewClasses.subscribe(classes => {
        //     this.currentView.objectClasses = classes;
        //     this.updateView();
        // });
    }

    updateViewClasses(updatedClasses: Map<number, models.Class[]>) {
        updatedClasses.forEach((objectClasses, objectId) => {
            this.currentClasses.set(objectId, objectClasses);
        });
        this.updatedViewClasses.next(updatedClasses);
    }

    updateLecturerWishes(wishes: Map<number, models.Wish[]>) {
        this.lecturerWishes = wishes;
        this.wishes.next(wishes);
    }

    private updateView(): void {
        this.view.next(this.currentView);
    }

    private setLecturers(facultyId: number): void {
        this.userService.getLecturersByFacultyIncludeRelated(facultyId)
            .subscribe((lecturers: models.User[]) => {
                this.viewObjects.next(lecturers.sort(compareUsersByName));
            });
    }

    private setLecturerClasses(lecturerId: number): void {
        this.classService.getClassesByLecturerAndYearAndSemester(
            lecturerId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((classes: models.Class[]) => {
                this.currentClasses.set(lecturerId, classes);
                this.updateViewClasses(this.currentClasses);
            });
    }

    private setLecturerWishes(lecturerId: number) {
        const lecturerWishes = this.lecturerWishes;
        this.wishService.getWishesByLecturerAndYearAndSemester(
            lecturerId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((wishes: models.Wish[]) => {
                lecturerWishes.set(lecturerId, wishes);
                this.updateLecturerWishes(lecturerWishes);
            });
    }

    private setGroups(facultyId: number): void {
        this.groupService.getGroupsByFaculty(facultyId)
            .subscribe((groups: models.Group[]) => {
                this.viewObjects.next(groups);
            });
    }

    private setGroupClasses(groupId: number): void {
        this.classService.getClassesByGroupAndYearAndSemester(
            groupId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((groupClasses: models.Class[]) => {
                this.currentClasses.set(groupId, groupClasses);
                this.updateViewClasses(this.currentClasses);
            });
    }

    onModalClose(changedClass: models.Class, viewObjectId: number): void {
        if (typeof (changedClass) === "number") {
            this.currentClasses.set(
                viewObjectId,
                this.currentClasses.get(viewObjectId).filter(
                    c => c.id !== changedClass));
        } else if (changedClass) {
            const c = this.currentClasses.get(viewObjectId).find(
                lc => lc.id === changedClass.id);
            c.frequency = changedClass.frequency;
            c.type = changedClass.type;
            c.classroomType = changedClass.classroomType;
            c.subject = changedClass.subject;
            c.classrooms = changedClass.classrooms;
            c.groups = changedClass.groups;
            c.lecturers = changedClass.lecturers;
        }

        // this.updateViewClasses();
    }
}

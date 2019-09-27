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
import { View } from "../models/view";

@Injectable()
export class ScheduleService {
    private facultyId: number;

    private viewClasses: Map<number, models.Class[]> = new Map();
    private lecturerWishes: Map<number, models.Wish[]> = new Map();

    private setViewClasses;

    view: BehaviorSubject<View> = new BehaviorSubject<View>({
        toggle: ViewToggle.LECTURERS,
        objects: [],
        objectClasses: new Map(),
        getObjectName: (id) => ""
    });
    // viewToggle: BehaviorSubject<ViewToggle> = new BehaviorSubject<ViewToggle>(ViewToggle.LECTURERS);
    viewObjects: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    viewClassesSubject: BehaviorSubject<Map<number, models.Class[]>> = new BehaviorSubject<Map<number, models.Class[]>>(new Map());

    // getViewObjectName;

    wishes: Subject<Map<number, models.Wish[]>> = new Subject<Map<number, models.Wish[]>>();

    constructor(private classService: ClassService,
        private userService: UserService,
        private wishService: WishService,
        private groupService: GroupService) {
        this.classService = classService;
        this.userService = userService;
    }

    setFaculty(facultyId: number): void {
        this.facultyId = facultyId;
    }

    setView(toggle: ViewToggle) {
        this.viewClasses = new Map();
        this.view.next(new View());
        this.viewObjects.next([]);
        this.viewClassesSubject.next(new Map());
        // this.viewToggle.next(toggle);
        let getObjectName: (obj: any) => string;
        // let setViewClasses: (id: number) => void;
        // let viewObjects;

        switch (toggle) {
            case ViewToggle.LECTURERS:
                // viewObjects = this.getLecturers(this.facultyId);
                getObjectName = getUserInitials;
                this.setLecturers(this.facultyId);
                this.setViewClasses = this.setLecturerClasses;
                this.viewObjects.subscribe((lecturers: models.User[]) => {
                    for (const lecturer of lecturers) {
                        this.setLecturerWishes(lecturer.id);
                    }
                });
                break;
            case ViewToggle.GROUPS:
                getObjectName = getCurrentGroupName;
                this.setGroups(this.facultyId);
                this.setViewClasses = this.setGroupClasses;
                this.setGroups(this.facultyId);
                break;
        }

        this.viewObjects.subscribe(objects => {
            debugger;
            for (const obj of objects) {
                this.setViewClasses(obj.id);
            }

            const currentView = Object.assign(this.view.value, {
                toggle: toggle,
                objects: objects,
                getObjectName: getObjectName
            });
            this.viewClassesSubject.subscribe(classes => {
                currentView.objectClasses = classes;
                this.view.next(currentView);
                // this.view.next({
                //     toggle: toggle,
                //     objects: objects,
                //     objectClasses: classes,
                //     getObjectName: getObjectName
                // });
            });
        });

        // viewObjects.subscribe(objects => {
        //     debugger;
        //     // const observableClasses = objects.map(o => this.getLecturerClasses(o.id));
        //     // const combined = combineLatest(observableClasses);
        //     // combined.subscribe(classes => {
        //     //     this.view.next({
        //     //         toggle: toggle,
        //     //         objects: objects,
        //     //         objectClasses: classes,
        //     //         getObjectName: getObjectName
        //     //     });
        //     // });
        //     const viewClasses = new Map();
        //     for (const obj of objects) {
        //         getObjectClasses(obj.id).subscribe(objectClasses => {
        //             viewClasses.set(obj.id, objectClasses);
        //             this.updateViewClasses(viewClasses);
        //         },
        //         err => console.error(err),
        //         () => {}
        //         );
        //         // const loaded = this.viewClasses;
        //         // setViewClasses(obj.id);
        //     }
        //     this.viewClassesSubject.subscribe(classes => {
        //         this.view.next({
        //             toggle: toggle,
        //             objects: objects,
        //             objectClasses: classes,
        //             getObjectName: getObjectName
        //         });
        //     },
        //     err => console.error(err),
        //     () => {}
        //     );
        // });
    }

    updateViewClasses(viewClasses: Map<number, models.Class[]>) {
        this.viewClasses = viewClasses;
        this.viewClassesSubject.next(viewClasses);
        // debugger;
        //         const currentView = this.view.getValue();
        //         currentView.objectClasses = viewClasses;
        //         this.view.next(currentView);
    }

    updateLecturerWishes(wishes: Map<number, models.Wish[]>) {
        this.lecturerWishes = wishes;
        this.wishes.next(wishes);
    }

    setLecturers(facultyId: number): void {
        this.userService.getLecturersByFacultyIncludeRelated(facultyId)
            .subscribe((lecturers: models.User[]) => {
                this.viewObjects.next(lecturers.sort(compareUsersByName));
                // const currentView = this.view.value;
                // currentView.objects = lecturers.sort(compareUsersByName);
                // this.view.next(currentView);
            });
    }

    getLecturers(facultyId: number): Observable<models.User[]> {
        return this.userService.getLecturersByFacultyIncludeRelated(facultyId);
    }

    setLecturerClasses(lecturerId: number): void {
        const viewClasses = this.viewClasses;
        this.classService.getClassesByLecturerAndYearAndSemester(
            lecturerId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((classes: models.Class[]) => {
                viewClasses.set(lecturerId, classes);
                this.updateViewClasses(viewClasses);
            });
    }

    setLecturerWishes(lecturerId: number) {
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

    setGroups(facultyId: number): void {
        this.groupService.getGroupsByFaculty(facultyId)
            .subscribe((groups: models.Group[]) => {
                this.viewObjects.next(groups);
                // const currentView = this.view.value;
                // currentView.objects = groups;
                // this.view.next(currentView);
            });
    }

    getGroups(facultyId: number): Observable<models.Group[]> {
        return this.groupService.getGroupsByFaculty(facultyId);
    }

    setGroupClasses(groupId: number): void {
        const classes = this.viewClasses;
        this.classService.getClassesByGroupAndYearAndSemester(
            groupId,
            getCurrentYear(),
            getCurrentSemester())
            .subscribe((groupClasses: models.Class[]) => {
                classes.set(groupId, groupClasses);
                this.updateViewClasses(classes);
                // this.availableClasses = this.availableClasses.filter(c =>
                //     !(c.groups.find(x => x.id === groupId)
                //         && classes.find(x => x.subject.id === c.subject.id
                //             && x.type === c.type))
                // );
            });
    }

    onModalClose(changedClass: models.Class, viewObjectId: number): void {
        if (typeof (changedClass) === "number") {
            this.viewClasses.set(
                viewObjectId,
                this.viewClasses.get(viewObjectId).filter(
                    c => c.id !== changedClass));
        } else if (changedClass) {
            const c = this.viewClasses.get(viewObjectId).find(
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

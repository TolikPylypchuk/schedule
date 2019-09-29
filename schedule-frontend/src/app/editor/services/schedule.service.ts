import { Injectable } from "@angular/core";
import { ViewToggle,
    getDay, getNumber,
    frequencyFromString, ClassFrequency, frequencyToString } from "../components/helpers";
import * as models from "../../common/models/models";
import { ClassService } from "../../common/services/services";
import {
    getDayOfWeekNumber,
    getDayOfWeekName
} from "../../common/models/functions";
import { ViewService } from "./view.service";
import { DragAndDropService } from "./drag-and-drop.service";
import { Cell, MovingCell, ViewContext } from "../models/models";
import { AvailableClassesService } from "./available-classes.service";

@Injectable()
export class ScheduleService {
    private facultyId: number;

    viewContext: ViewContext;
    viewClasses: models.Class[];

    constructor(
        private classService: ClassService,
        private viewService: ViewService,
        private dragAndDropService: DragAndDropService,
        private availableClassesService: AvailableClassesService) {
        this.viewService.context.subscribe(viewContext => {
            this.viewContext = viewContext;
        });
        this.viewService.updatedViewClasses.subscribe(() => {
            this.viewClasses = this.getAggregatedClasses();
        });
    }

    private getAggregatedClasses(): models.Class[] {
        let viewClasses = [];
        if (!this.viewClasses as any) {
            return viewClasses;
        }

        for (const obj of this.viewContext.objects) {
            const objectClasses = this.viewService.currentClasses.get(obj.id);
            if (objectClasses as any && objectClasses.length > 0) {
                viewClasses = viewClasses.concat(objectClasses.filter(c => !viewClasses.includes(c)));
            }
        }

        return viewClasses;
    }

    setFaculty(facultyId: number): void {
        this.facultyId = facultyId;
    }

    setView(toggle: ViewToggle) {
        this.viewService.setView(toggle, this.facultyId);
        this.availableClassesService.setAvailableClasses(this.facultyId);
    }

    canDrop(dropCell: MovingCell): boolean {
        const dragClass = this.dragAndDropService.dragClass;

        if (!dragClass) {
            return true;
        }

        const checkCell = new Cell(dropCell);

        return this.isViewObjectSuitable(dropCell.viewObjectId, dragClass) &&
            this.areClassLecturersAvailable(dragClass, checkCell) &&
            this.areClassGroupsAvailable(dragClass, checkCell) &&
            this.areClassRoomsAvailable(dragClass, checkCell);
        // let canDrop = this.viewToggle === ViewToggle.GROUPS
        // 	&& !!this.dragClass.groups.find(l => l.id === viewObjectId)
        // 	|| this.viewToggle === ViewToggle.LECTURERS
        // 	&& !!this.dragClass.subject.lecturers.find(l => l.id === viewObjectId);

        // check if available for class lecturers
        // canDrop = canDrop
        //     && (!this.dragClass.lecturers || !this.dragClass.lecturers.find(l => {
        //         const classes = this.lecturersClasses.get(l.id);
        //         return !!classes && classes.find(c => getDayOfWeekNumber(c.dayOfWeek) === this.getDay(dropPsition) &&
        //             c.number === this.getNumber(dropPsition) &&
        //             (frequencyFromString(c.frequency) === ClassFrequency.WEEKLY ||
        //                 frequencyFromString(c.frequency) === dropFrequency)) as any;
        //     }));

        // // check if available for class groups
        // canDrop = canDrop
        //     && (!this.dragClass.groups || !this.dragClass.groups.find(g => {
        //         const classes = this.groupsClasses.get(g.id);
        //         return !!classes && classes.find(c => getDayOfWeekNumber(c.dayOfWeek) === this.getDay(dropPsition) &&
        //             c.number === this.getNumber(dropPsition) &&
        //             (frequencyFromString(c.frequency) === ClassFrequency.WEEKLY ||
        //                 frequencyFromString(c.frequency) === dropFrequency)) as any;
        //     }));

        // return canDrop;
    }

    isViewObjectSuitable(objectId: number, dragClass: models.Class): boolean {
        const viewObjects = this.viewContext.getSuitableObjects(dragClass);

        return viewObjects.some(obj => obj.id === objectId);
    }

    isClassAffixed(c: models.Class, checkCell: Cell): boolean {
        return getDayOfWeekNumber(c.dayOfWeek) === getDay(checkCell.day) &&
            c.number === getNumber(checkCell.number) &&
            (frequencyFromString(c.frequency) === ClassFrequency.WEEKLY ||
                frequencyFromString(c.frequency) === checkCell.frequency);
    }

    areClassLecturersAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const lecturers = dragClass.lecturers;

        return !lecturers || !lecturers.some(lecturer => !this.isLecturerAvailable(lecturer, checkCell));
    }

    isLecturerAvailable(lecturer: models.User, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.lecturers.includes(lecturer) && this.isClassAffixed(c, checkCell));
    }

    areClassGroupsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const groups = dragClass.groups;

        return !groups || !groups.some(group => !this.isGroupAvailable(group, checkCell));
    }

    isGroupAvailable(group: models.Group, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.groups.includes(group) && this.isClassAffixed(c, checkCell));
    }

    areClassRoomsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const classroorms = dragClass.classrooms;

        return !classroorms || !classroorms.some(classroorm => !this.isRoomAvailable(classroorm, checkCell));
    }

    isRoomAvailable(classroorm: models.Classroom, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.classrooms.includes(classroorm) && this.isClassAffixed(c, checkCell));
    }

    startDrag(c: models.Class, viewObjectId: number, position: number): void {
        this.dragAndDropService.startDrag(c, viewObjectId, position);
    }

    addDropItem(c: models.Class, viewObjectId: number, position: number, frequency: number): void {
        this.dragAndDropService.addDropItem(c, viewObjectId, position, frequency);
    }

    releaseDrop(c: models.Class): void {
        const dropCell = this.dragAndDropService.getDropCell();
        const dragCell = this.dragAndDropService.getDragCell();

        if (dropCell.position !== -1 && !this.canDrop(dropCell)) {
            this.dragAndDropService.releaseDrop();
            return;
        }

        const movedClass = Object.assign({}, {
            ...c,
            dayOfWeek: getDayOfWeekName(getDay(dropCell.position)),
            number: getNumber(dropCell.position),
            frequency: frequencyToString(dropCell.frequency),
        });

        if (this.dragAndDropService.addToView()) {
            this.addToView(c, movedClass, dragCell, dropCell);
        } else if (this.dragAndDropService.removeFromView()) {
            this.removeFromView(c, movedClass, dragCell, dropCell);
        } else if (this.dragAndDropService.changeViewObject()) {
            this.moveThroughViewObjects(movedClass, dragCell, dropCell);
        } else {
            this.moveOnView(movedClass);
        }

        this.dragAndDropService.releaseDrop();
    }

    private addToView(
        dragClass: models.Class,
        movedClass: models.Class,
        dragCell: MovingCell,
        dropCell: MovingCell) {
        const dropViewObject = this.viewContext.objects.find(obj => obj.id === dropCell.viewObjectId);
        const updated = this.viewContext.addClassContextObjectToView(movedClass, dropViewObject);

        const action = this.classService.addClass(updated);
        action.subscribe(() => {
            const updatedClasses = this.changeViewObject(updated, dragCell, dropCell);
            const updateAvailableClasses = this.availableClassesService.classes.value
                .filter(cl => cl !== dragClass);

                this.updateView(updatedClasses, updateAvailableClasses);
            });
            action.connect();
    }

    private removeFromView(
        dragClass: models.Class,
        movedClass: models.Class,
        dragCell: MovingCell,
        dropCell: MovingCell) {
        const dragViewObject = this.viewContext.objects.find(obj => obj.id === dragCell.viewObjectId);
        const updated = this.viewContext.removeClassContextObjectFromView(movedClass, dragViewObject);
        const updateAvailableClasses = this.availableClassesService.classes.value;
        const updatedClasses = this.changeViewObject(dragClass, dragCell, dropCell);
        if (this.viewContext.shouldAddToAvailableClasses(updated)) {
            const action = this.classService.deleteClass(movedClass.id);
            action.subscribe(() => {
                this.updateView(updatedClasses, [...updateAvailableClasses, updated]);
            });
            action.connect();
        } else {
            const action = this.classService.updateClass(updated);
            action.subscribe(() => {
                this.updateView(updatedClasses, updateAvailableClasses);
            });
            action.connect();
        }
    }

    private moveThroughViewObjects(
        movedClass: models.Class,
        dragCell: MovingCell,
        dropCell: MovingCell) {
        const dropViewObject = this.viewContext.objects.find(obj => obj.id === dropCell.viewObjectId);
        const dragViewObject = this.viewContext.objects.find(obj => obj.id === dragCell.viewObjectId);
        const contextObjects = [
            ...this.viewContext.getClassContextObjects(movedClass).filter(obj => obj !== dragViewObject),
            dropViewObject
        ];
        const updated = this.viewContext.setClassContextObject(movedClass, contextObjects);

        const updatedClasses = this.changeViewObject(updated, dragCell, dropCell);
        const updateAvailableClasses = this.availableClassesService.classes.value;

        const action = this.classService.updateClass(updated);
        action.subscribe(() => {
            this.updateView(updatedClasses, updateAvailableClasses);
        });
        action.connect();
    }

    private moveOnView(movedClass: models.Class) {
        const action = this.classService.updateClass(movedClass);
        const updatedClasses = this.changePosition(movedClass);
        const updateAvailableClasses = this.availableClassesService.classes.value;
        action.subscribe(() => {
            this.updateView(updatedClasses, updateAvailableClasses);
        });
        action.connect();
    }

    private changeViewObject(
        movedClass: models.Class,
        dragCell: MovingCell,
        dropCell: MovingCell): Map<number, models.Class[]> {
        let updateClassesFor = [];

        updateClassesFor = this.viewContext.getClassContextObjects(movedClass);

        const updatedClasses = new Map<number, models.Class[]>();
        const currentClasses = this.viewService.currentClasses;

        for (const obj of updateClassesFor) {
            let classes = currentClasses.get(obj.id);
            if (!classes) {
                classes = [];
            }

            if (obj.id === dragCell.viewObjectId) {
                classes = classes.filter(c => c.id !== movedClass.id);
            } else if (obj.id === dropCell.viewObjectId) {
                classes = [...classes, movedClass];
            } else {
                classes = classes.map(c => c.id === movedClass.id ? movedClass : c);
            }

            updatedClasses.set(obj.id, classes);
        }

        return updatedClasses;
    }

    private changePosition(
        movedClass: models.Class): Map<number, models.Class[]> {
        const updateClassesFor = this.viewContext.getClassContextObjects(movedClass);

        const updatedClasses = new Map<number, models.Class[]>();
        const currentClasses = this.viewService.currentClasses;

        for (const obj of updateClassesFor) {
            const classes = currentClasses.get(obj.id).map(c => c.id === movedClass.id ? movedClass : c);
            updatedClasses.set(obj.id, classes);
        }

        return updatedClasses;
    }

    private updateView(viewClasses: Map<number, models.Class[]>, availableClasses: models.Class[]) {
        this.viewService.updateViewClasses(viewClasses);
        this.availableClassesService.updateAvailableClasses(availableClasses);
    }
}

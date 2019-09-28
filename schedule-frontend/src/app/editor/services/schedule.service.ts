import { Injectable } from "@angular/core";
import { ViewToggle, getDay, getNumber, frequencyFromString, ClassFrequency, frequencyToString } from "../components/helpers";
import { Observable } from "rxjs/Observable";
import * as models from "../../common/models/models";
import { ClassService, UserService, WishService, GroupService } from "../../common/services/services";
import {
    getCurrentYear,
    getCurrentSemester,
    compareUsersByName,
    getUserInitials,
    getCurrentGroupName,
    getDayOfWeekNumber,
    getDayOfWeekName
} from "../../common/models/functions";
import { ViewService } from "./view.service";
import { DragAndDropService } from "./drag-and-drop.service";
import { View, Cell, MovingCell } from "../models/models";

@Injectable()
export class ScheduleService {
    private facultyId: number;

    view: View;
    viewClasses: models.Class[];

    constructor(
        private classService: ClassService,
        private viewService: ViewService,
        private dragAndDropService: DragAndDropService) {
        this.viewService.view.subscribe(view => {
            this.view = view;
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

        for (const obj of this.view.objects) {
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
        let viewObjects = [];
        switch (this.view.toggle) {
            case ViewToggle.LECTURERS:
                viewObjects = dragClass.subject.lecturers;
                break;
            case ViewToggle.GROUPS:
                viewObjects = dragClass.groups;
                break;
        }

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

        return lecturers as any || !lecturers.some(lecturer => !this.isLecturerAvailable(lecturer, checkCell));
    }

    isLecturerAvailable(lecturer: models.User, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.lecturers.includes(lecturer) && this.isClassAffixed(c, checkCell));
    }

    areClassGroupsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const groups = dragClass.groups;

        return groups as any || !groups.some(group => !this.isGroupAvailable(group, checkCell));
    }

    isGroupAvailable(group: models.Group, checkCell: Cell): boolean {
        return !this.viewClasses.some(c =>
            c.groups.includes(group) && this.isClassAffixed(c, checkCell));
    }

    areClassRoomsAvailable(dragClass: models.Class, checkCell: Cell): boolean {
        const classroorms = dragClass.classrooms;

        return classroorms as any || !classroorms.some(classroorm => !this.isRoomAvailable(classroorm, checkCell));
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

		if (dropCell.position !== -1 && !this.canDrop(dropCell)) {
            this.dragAndDropService.releaseDrop();
			return;
        }

        let updateFor = [];
        switch (this.view.toggle) {
            case ViewToggle.LECTURERS:
                updateFor = c.lecturers;
                break;
            case ViewToggle.GROUPS:
                updateFor = c.groups;
                break;
        }

        const movedClass = Object.assign(c, {
            dayOfWeek: getDayOfWeekName(getDay(dropCell.position)),
            number: getNumber(dropCell.position),
            frequency: frequencyToString(dropCell.frequency)
        });

        if (this.dragAndDropService.addToView()) {
            // ...
        } else if (this.dragAndDropService.removeFromView()) {
            // ...
        } else if (this.dragAndDropService.changeViewObject()) {
            // ...
        }

        const updatedClasses = new Map<number, models.Class[]>();
        for (const obj of updateFor) {
            updatedClasses.set(obj.id, this.viewService.currentClasses.get(obj.id).map(x => {
                return x.id === movedClass.id
                    ? movedClass
                    : x;
            }));
        }
		const action = !movedClass.id
        ? this.classService.addClass(movedClass)
        : movedClass.lecturers.length > 0
            ? this.classService.updateClass(movedClass)
            : this.classService.deleteClass(movedClass.id);

        action.subscribe(() => this.viewService.updateViewClasses(updatedClasses));
        action.connect();
		// this.updateOnDrop(c);

		// const viewCells = this.viewCells;
		// this.viewCells = viewCells;

        // this.showDenominator = false;
        this.dragAndDropService.releaseDrop();
	}
}

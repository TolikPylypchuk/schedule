import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "../class-modal.component";

import * as models from "../../../common/models/models";
import {
	getClassStart, getClassEnd,
	getDayOfWeekNumber,	getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString
} from "../../../common/models/functions";

import {
	ClassCell, ClassFrequency, ViewToggle,
	frequencyFromString, frequencyToString, isClassFull, getDay, getNumber, getArrayOfNumbers
} from "../helpers";
import { DragAndDropService } from "../../services/drag-and-drop.service";
import { ViewService } from "../../services/view.service";
import { ScheduleService } from "../../services/schedule.service";
import { MovingCell } from "../../models/models";

@Component({
	selector: "schedule-editor-view",
    templateUrl: "./view.component.html"
})

export class ViewComponent implements OnInit, OnDestroy {
    private modalService: NgbModal;

    @ViewChild("scheduleTable")
    private table: ElementRef;

	private scrollLeft = false;
    private scrollRight = false;
    private fontSize = 1;

    showDenominator = false;
    viewToggle = ViewToggle.LECTURERS;

	viewObjects: models.User[] | models.Group[] = [];
	viewClasses: Map<number, models.Class[]> = new Map();
    viewCells: Map<number, ClassCell[]> = new Map();

    wishes: Map<number, models.Wish[]> = new Map();

    areLoaded: Map<number, boolean> = new Map();
    getViewObjectName;

	getClassStart = getClassStart;
    getClassEnd = getClassEnd;
    getDay = getDay;
    getNumber = getNumber;
	getDayOfWeekName = getDayOfWeekName;
    getDayOfWeekNumber = getDayOfWeekNumber;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
    getClassroomsAsString = getClassroomsAsString;
    getArrayOfNumbers = getArrayOfNumbers;

    isClassFull = isClassFull;

	constructor(modalService: NgbModal,
		private dragAndDropService: DragAndDropService,
		private viewService: ViewService,
		private scheduleService: ScheduleService) {
		setInterval(() => {
			if (this.scrollRight) {
				this.table.nativeElement.scrollBy(10, 0);
			}

			if (this.scrollLeft) {
				this.table.nativeElement.scrollBy(-10, 0);
			}
		}, 100);
	}

	ngOnInit(): void {
		this.viewService.view.subscribe(view => {
			this.viewCells = new Map();
			this.viewToggle = view.toggle;
			this.viewObjects = view.objects;
			this.getViewObjectName = view.getObjectName;
		});

		this.viewService.updatedViewClasses.subscribe(updatedClasses => {
			const viewCells = this.viewCells;
			updatedClasses.forEach((classes, viewObjectId) => {
				viewCells.set(viewObjectId, this.getViewClasses(classes));
				this.areLoaded.set(viewObjectId, true);
			});

			this.viewCells = viewCells;
		});
		this.viewService.wishes.subscribe(wishes => this.wishes = wishes);
	}

	ngOnDestroy(): void {
		this.viewService.view.unsubscribe();
	}

	decreaseSize(): void {
		if (this.fontSize > 0.2) {
			this.fontSize -= 0.2;
		}
	}

	increaseSize(): void {
		if (this.fontSize < 2) {
			this.fontSize += 0.2;
		}
	}

	getClass(
		viewObjectId: number,
		day: number,
		num: number,
		frequency: string): models.Class | undefined {
		const classes = this.viewClasses.get(viewObjectId);

		return classes.find(
			c => getDayOfWeekNumber(c.dayOfWeek) === day &&
				c.number === num &&
				c.frequency.toLowerCase() === frequency.toLowerCase());
	}

	getViewClasses(classes: models.Class[]): ClassCell[] | undefined {
		const result = getArrayOfNumbers(45).map(n => {
			const cell: ClassCell = new ClassCell();
			cell.n = n;
			cell.frequency = ClassFrequency.NONE;

			const day = getDay(n);
			const num = getNumber(n);
			if (classes && classes.length !== 0) {
				const filtered = classes.filter(
					c => getDayOfWeekNumber(c.dayOfWeek) === day &&
						c.number === num);
				if (filtered.length === 2) {
					cell.frequency = ClassFrequency.BIWEEKLY;
				} else if (filtered.length === 1) {
					cell.frequency = frequencyFromString(filtered[0].frequency);
				}

				cell.weekly = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.WEEKLY);
				cell.numerator = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.NUMERATOR);
				cell.denominator = filtered.find(c => frequencyFromString(c.frequency) === ClassFrequency.DENOMINATOR);
			}

			return cell;
		});

		return result;
    }

	canDrop(viewObjectId: number, dropPosition: number, dropFrequency: number): boolean {
		const dropCell = new MovingCell(viewObjectId, dropPosition, dropFrequency);

		return this.scheduleService.canDrop(dropCell);
    }

	isSuitable(lecturer: models.User, n: number): string {
		if (this.viewToggle !== ViewToggle.LECTURERS) {
			return "";
		}

        const wish = this.getWish(lecturer.id, this.getDay(n), this.getNumber(n));

		return !wish
			? ""
			: `suitable-${wish.suitable}`;
    }

	getWish(lecturerId: number, day: number, classNum: number): models.Wish {
		let wish: models.Wish = null;
		const wishes = this.wishes.get(lecturerId);
		if (wishes != null) {
			wish = wishes.find(w => {
				return getDayOfWeekNumber(w.dayOfWeek) === day
					&& w.startTime.localeCompare(getClassStart(classNum) + ":00") <= 0
					&& w.endTime.localeCompare(getClassEnd(classNum) + ":00") >= 0;
			});
		}
		return wish;
	}

	editClassClicked(
		classObject: models.Class,
		viewObject: models.User | models.Group): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
        const modal = modalRef.componentInstance as ClassModalComponent;

        switch (this.viewToggle) {
            case ViewToggle.LECTURERS:
                modal.contextLecturer = viewObject as models.User;
                modal.contextGroup = null;
                break;
            case ViewToggle.GROUPS:
                modal.contextLecturer = null;
                modal.contextGroup = viewObject as models.Group;
                break;
        }

		const frequency = classObject.frequency;

		const reverseFrequencyName = frequency === "По чисельнику"
			? "По знаменнику"
			: "По чисельнику";

		modal.currentClass = classObject;

		modal.isEditing = true;
		modal.frequencySet = classObject.frequency !== "Щотижня" &&
			this.getClass(viewObject.id, this.getDayOfWeekNumber(classObject.dayOfWeek), classObject.number, reverseFrequencyName) as any;

		modalRef.result.then(
			(changedClass: models.Class | number) => {
				if (typeof (changedClass) === "number") {
					this.viewClasses.set(
						viewObject.id,
						this.viewClasses.get(viewObject.id).filter(
							c => c.id !== changedClass));
				} else if (changedClass) {
					const c = this.viewClasses.get(viewObject.id).find(
						lc => lc.id === changedClass.id);
					c.frequency = changedClass.frequency;
					c.type = changedClass.type;
					c.classroomType = changedClass.classroomType;
					c.subject = changedClass.subject;
					c.classrooms = changedClass.classrooms;
					c.groups = changedClass.groups;
					c.lecturers = changedClass.lecturers;
				}
			},
			() => { });
	}

	addClassClicked(
		frequency: ClassFrequency,
		day: number,
		num: number,
		viewObject: models.User | models.Group,
		wish: models.Wish): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		modal.currentClass.frequency = frequency === ClassFrequency.NONE
			? "Щотижня"
			: frequency === ClassFrequency.NUMERATOR
				? "По чисельнику"
				: "По знаменнику";
		modal.frequencySet = frequency !== ClassFrequency.NONE;
		modal.currentClass.dayOfWeek = getDayOfWeekName(day);
		modal.currentClass.number = num;
		modal.wish = wish;

		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				break;
			case ViewToggle.LECTURERS:
				modal.contextLecturer = viewObject as models.User;
				modal.currentClass.lecturers = [viewObject as models.User];
				break;
		}

		modalRef.result.then(
			(newClass: models.Class) =>
				this.viewClasses.get(viewObject.id).push(newClass),
			() => { });
    }

	startDrag(c: models.Class, viewObjectId: number, position: number): void {
        this.scheduleService.startDrag(c, viewObjectId, position);
    }

	addDropItem(c: models.Class, viewObjectId: number, position: number, frequency: number): void {
        this.scheduleService.addDropItem(c, viewObjectId, position, frequency);
	}

	releaseDrop(c: models.Class): void {
		this.scheduleService.releaseDrop(c);
        this.showDenominator = false;
	}

	updateOnDrop(c: models.Class): void {
        // let viewObjects = [];
		// switch (this.viewToggle) {
		// 	case ViewToggle.GROUPS:
        //         viewObjects = this.viewObjects as models.Group[];
		// 		break;
		// 	case ViewToggle.LECTURERS:
		// 		break;
		// }
        // const viewObjectId = this.dragAndDropService.dropViewObjectId;

		// if (this.dragAndDropService.addToView) {
		// 	viewObjects = [viewObjects.find(l => l.id === viewObjectId)];
		// 	c = this.updateDroppedClass(c, viewObjects);

		// 	this.viewClasses.set(viewObjectId, [...this.viewClasses.get(viewObjectId), c]);
		// } else if (this.dragAndDropService.removeFromView) {
		// 	c.lecturers = c.lecturers.filter(l => l.id !== this.dragAndDropService.dragViewObjectId);

		// 	this.viewClasses.set(
		// 		this.dragAndDropService.dragViewObjectId,
		// 		this.viewClasses.get(this.dragAndDropService.dragViewObjectId).filter(cl => cl.id !== c.id));

		// 	if (c.lecturers.length === 0) {
		// 		c.dayOfWeek = null;
		// 		c.number = 0;
		// 		c.frequency = frequencyToString(this.dragAndDropService.dragFrequency);
		// 	}
		// } else if (this.dragAndDropService.dragViewObjectId !== this.dragAndDropService.dropViewObjectId) {
			// viewObjects.push(viewObjects.find(l => l.id === viewObjectId));
			// c.lecturers = lecturers.filter(l => l.id !== this.dragViewObjectId);
			// this.lecturersClasses.set(
			// 	this.dragViewObjectId,
			// 	this.lecturersClasses.get(this.dragViewObjectId).filter(cl => cl.id !== c.id));

			// const classes = this.lecturersClasses.get(this.dropViewObjectId);
			// classes.push(c);
			// this.lecturersClasses.set(
			// 	this.dropViewObjectId,
			// 	classes);
		// }

		// const action = !c.id
		// 	? this.classService.addClass(c)
		// 	: c.lecturers.length > 0
		// 		? this.classService.updateClass(c)
		// 		: this.classService.deleteClass(c.id);

		// action.subscribe();
		// action.connect();


		// this.view.viewClasses = this.lecturersClasses;

		// this.lecturersClasses = this.view.viewClasses;

		// return lecturers;
    }

    // updateDroppedClass(c: models.Class, updatedViewObjects: any[]): models.Class {
    //     c = this.dragAndDropService.updateDroppedClass(c);

	// 	switch (this.viewToggle) {
	// 		case ViewToggle.GROUPS:
    //             c.groups = updatedViewObjects as models.Group[];
	// 			break;
	// 		case ViewToggle.LECTURERS:
	// 			c.lecturers = updatedViewObjects as models.User[];
	// 			break;
	// 	}

    //     return c;
    // }
}

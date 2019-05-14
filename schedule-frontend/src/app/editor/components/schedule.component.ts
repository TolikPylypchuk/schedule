import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../auth/auth";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";
import {
	getCurrentYear, getCurrentSemester, getUserInitials,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareUsersByName, getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString,
	getShortName
} from "../../common/models/functions";

import {
	ClassCell, ClassFrequency, ViewToggle,
	frequencyFromString, frequencyToString
} from "./helpers";

// export enum ClassFrequency {
// 	NONE,
// 	WEEKLY,
// 	NUMERATOR,
// 	DENOMINATOR,
// 	BIWEEKLY
// }

// export function fromString(frequency: string): ClassFrequency {
// 	let result = ClassFrequency.NONE;
// 	switch (frequency) {
// 		case "Щотижня":
// 		result = ClassFrequency.WEEKLY;
// 		break;
// 		case "По чисельнику":
// 		result = ClassFrequency.NUMERATOR;
// 		break;
// 		case "По знаменнику":
// 		result = ClassFrequency.DENOMINATOR;
// 		break;
// 	}

// 	return result;
// }

// export class ClassCell {
// 	n: number;
// 	frequency: ClassFrequency;
// 	weekly: models.Class;
// 	numerator: models.Class;
// 	denominator: models.Class;
// }

@Component({
	selector: "schedule-editor-schedule",
	templateUrl: "./schedule.component.html"
})
export class ScheduleComponent implements OnInit {
	private modalService: NgbModal;

	private authService: AuthService;

	private classService: services.ClassService;
	private groupService: services.GroupService;
	private userService: services.UserService;
	private wishService: services.WishService;

	private viewToggle = ViewToggle.LECTURERS;
	private fontSize = 1;

	private scrollLeft = false;
	private scrollRight = false;

	private dragPosition: number;
	private dragFrequency: number;
	private dragClass: models.Class;
	private dragLecturer: models.User;

	private dropPosition: number;
	private dropFrequency: number;
	private dropLecturer: models.User;

	@ViewChild("scheduleTable") table: ElementRef;

	showDenominator = false;

	currentUser: models.User;

	lecturers: models.User[] = [];
	lecturersClasses: Map<number, models.Class[]> = new Map();
	lecturersClassesAll: Map<number, ClassCell[]> = new Map();
	lecturerWishes: Map<number, models.Wish[]> = new Map();

	groups: models.User[] = [];
	groupsClasses: Map<number, models.Class[]> = new Map();
	groupsClassesAll: Map<number, ClassCell[]> = new Map();

	viewClasses: Map<number, models.Class[]> = new Map();
	viewClassesAll: Map<number, ClassCell[]> = new Map();

	availableClasses: models.Class[];
	areLoaded: Map<number, boolean> = new Map();


	getLecturerInitials = getUserInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;
	getDayOfWeekNumber = getDayOfWeekNumber;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
	getClassroomsAsString = getClassroomsAsString;
	getShortName = getShortName;

	floor = Math.floor;

	constructor(
		modalService: NgbModal,
		authService: AuthService,
		classService: services.ClassService,
		groupService: services.GroupService,
		userService: services.UserService,
		wishService: services.WishService) {
		this.modalService = modalService;
		this.authService = authService;
		this.classService = classService;
		this.groupService = groupService;
		this.userService = userService;
		this.wishService = wishService;

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
		this.showDenominator = false;
		this.authService.getCurrentUser()
			.subscribe((user: models.User) => {
				this.currentUser = user;

				this.userService.getLecturersByFaculty(user.department.faculty.id)
					.subscribe((lecturers: models.User[]) => {
						this.lecturers = lecturers.sort(compareUsersByName);
						console.log("added");

						for (const lecturer of lecturers) {
							this.areLoaded.set(lecturer.id, false);
							this.classService.getClassesByLecturerAndYearAndSemester(
								lecturer.id,
								getCurrentYear(),
								getCurrentSemester())
								.subscribe((classes: models.Class[]) => {
									this.lecturersClasses.set(lecturer.id, classes);
									this.lecturersClassesAll.set(lecturer.id, this.getLecturerClasses(lecturer));

									this.viewClasses = this.lecturersClasses;
									this.viewClassesAll = this.lecturersClassesAll;
									this.areLoaded.set(lecturer.id, true);
								});
							this.wishService.getWishesByLecturerAndYearAndSemester(
								lecturer.id,
								getCurrentYear(),
								getCurrentSemester())
								.subscribe((wishes: models.Wish[]) => {
									this.lecturerWishes.set(lecturer.id, wishes);
								});
						}
					});

				this.classService.getGeneratedClassesByFacultyAndYearAndSemester(
					user.department.faculty.id,
					getCurrentYear(),
					getCurrentSemester()
				).subscribe((classes: models.Class[]) => {
					this.availableClasses = classes;
				});
			});
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
		lecturer: models.User,
		day: number,
		num: number,
		frequency: string): models.Class | undefined {
		const classes = this.lecturersClasses.get(lecturer.id);
		return classes.find(
			c => getDayOfWeekNumber(c.dayOfWeek) === day &&
				c.number === num &&
				c.frequency.toLowerCase() === frequency.toLowerCase());
	}

	getLecturerClasses(
		lecturer: models.User): ClassCell[] | undefined {

		const classes = this.lecturersClasses.get(lecturer.id);

		const result = this.getArrayOfNumbers(45).map(n => {
			const cell: ClassCell = new ClassCell();
			cell.n = n;
			cell.frequency = ClassFrequency.NONE;

			const day = this.getDay(n);
			const num = this.getNumber(n);
			if (classes && classes.length !== 0) {
				const filtered = classes.filter(
					c => getDayOfWeekNumber(c.dayOfWeek) === day &&
						c.number === num);
				if (filtered.length === 2) {
					cell.frequency = ClassFrequency.BIWEEKLY;
				} else if (filtered.length === 1) {
					const f = filtered[0].frequency.toLowerCase();
					cell.frequency = f === "щотижня"
						? ClassFrequency.WEEKLY
						: f === "по чисельнику"
							? ClassFrequency.NUMERATOR
							: ClassFrequency.DENOMINATOR;
				}

				cell.weekly = filtered.find(c => c.frequency.toLowerCase() === "щотижня");
				cell.numerator = filtered.find(c => c.frequency.toLowerCase() === "по чисельнику");
				cell.denominator = filtered.find(c => c.frequency.toLowerCase() === "по знаменнику");
			}

			return cell;
		});

		return result;
	}

	isSuitable(lecturer: models.User, n: number): string {
		const wish = this.getWish(lecturer.id, this.getDay(n), this.getNumber(n));
		return wish === null
			? ""
			: `suitable-${wish.suitable}`;
	}

	getDay(n: number): number {
		return this.floor(n / 9 + 1);
	}

	getNumber(n: number): number {
		return n % 9 + 1;
	}

	getArrayOfNumbers(num: number): number[] {
		return Array.apply(null, { length: num }).map(Number.call, Number);
	}

	startDrag(c: models.Class, lecturer: models.User, position: number): void {
		this.dragPosition = position;
		this.dragFrequency = c.frequency === "Щотижня"
			? ClassFrequency.WEEKLY
			: c.frequency === "По чисельнику"
				? ClassFrequency.NUMERATOR
				: ClassFrequency.DENOMINATOR;
		this.dragClass = c;
		this.dragLecturer = lecturer;
		this.showDenominator = c.frequency !== "Щотижня";
	}

	canDrop(lecturer: models.User): boolean {
		return !this.dragClass || !lecturer || this.dragClass.subject.lecturers.map(l => l.id).includes(lecturer.id);
	}

	releaseDrop(c: models.Class): void {
		let lecturers = c.lecturers;

		c = this.updateDroppedClass(c);

		if (this.dragPosition === -1) {
			lecturers = [this.dropLecturer];
			c.lecturers = lecturers;

			const classes = this.lecturersClasses.get(this.dropLecturer.id);
			classes.push(c);
			this.lecturersClasses.set(this.dropLecturer.id, classes);

			this.availableClasses = this.availableClasses.filter(cl => cl !== c);
		} else if (this.dropPosition === -1) {
			c.lecturers = c.lecturers.filter(l => l.id !== this.dragLecturer.id);

			this.lecturersClasses.set(
				this.dragLecturer.id,
				this.lecturersClasses.get(this.dragLecturer.id).filter(cl => cl.id !== c.id));

			if (c.lecturers.length === 0) {
				c.dayOfWeek = null;
				c.number = 0;
				c.frequency = frequencyToString(this.dragFrequency);
				this.availableClasses.push(c);
			}
		} else if (this.dragLecturer.id !== this.dropLecturer.id) {
			lecturers.push(this.dropLecturer);
			c.lecturers = lecturers.filter(l => l.id !== this.dragLecturer.id);

			this.lecturersClasses.set(
				this.dragLecturer.id,
				this.lecturersClasses.get(this.dragLecturer.id).filter(cl => cl.id !== c.id));

			const classes = this.lecturersClasses.get(this.dropLecturer.id);
			classes.push(c);
			this.lecturersClasses.set(
				this.dropLecturer.id,
				classes);
		}

		this.viewClasses = this.lecturersClasses;
		this.updateAssosiated(c, c.lecturers);
		this.lecturersClasses = this.viewClasses;

		const lecturerClassesAll = this.lecturersClassesAll;

		for (const lecturer of lecturers) {
			lecturerClassesAll.set(lecturer.id, this.getLecturerClasses(lecturer));
		}

		this.lecturersClassesAll = lecturerClassesAll;

		this.showDenominator = false;
		this.dragClass = null;
		this.dragLecturer = null;
		this.dropLecturer = null;
	}

	addDropItem(c: models.Class, lecturer: models.User, position: number, frequency: number): void {
		this.dropPosition = position;
		this.dropFrequency = position !== -1
			? frequency
			: frequencyFromString(c.frequency);
		this.dropLecturer = lecturer;
	}

	updateDroppedClass(c: models.Class): models.Class {
		if (this.dropPosition !== -1) {
			c.dayOfWeek = getDayOfWeekName(this.getDay(this.dropPosition));
			c.number = this.getNumber(this.dropPosition);
			c.frequency = frequencyToString(this.dropFrequency);
		}

		return c;
	}

	updateAssosiated(c: models.Class, assosiated: models.User[] | models.Group[]): void {
		for (const assosiate of assosiated) {
			this.viewClasses.set(
				assosiate.id,
				this.viewClasses.get(assosiate.id).map(cl => cl.id === c.id ? c : cl));
		}
	}

	editClassClicked(
		classObject: models.Class,
		lecturer: models.User): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		modal.contextLecturer = lecturer;

		const frequency = classObject.frequency;

		const reverseFrequencyName = frequency === "По чисельнику"
			? "По знаменнику"
			: "По чисельнику";

		modal.currentClass = classObject;

		modal.isEditing = true;
		modal.frequencySet = classObject.frequency !== "Щотижня" &&
			this.getClass(lecturer, this.getDayOfWeekNumber(classObject.dayOfWeek), classObject.number, reverseFrequencyName) as any;

		modalRef.result.then(
			(changedClass: models.Class | number) => {
				if (typeof (changedClass) === "number") {
					this.lecturersClasses.set(
						lecturer.id,
						this.lecturersClasses.get(lecturer.id).filter(
							c => c.id !== changedClass));
				} else if (changedClass) {
					const c = this.lecturersClasses.get(lecturer.id).find(
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
		lecturer: models.User,
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
		modal.contextLecturer = lecturer;
		modal.currentClass.lecturers = [lecturer];
		modal.wish = wish;

		modalRef.result.then(
			(newClass: models.Class) =>
				this.lecturersClasses.get(lecturer.id).push(newClass),
			() => { });
	}

	getWish(lecturerId: number, day: number, classNum: number): models.Wish {
		let wish: models.Wish = null;
		const wishes = this.lecturerWishes.get(lecturerId);
		if (wishes != null) {
			wish = wishes.find(w => {
				return getDayOfWeekNumber(w.dayOfWeek) === day
					&& w.startTime.localeCompare(getClassStart(classNum) + ":00") <= 0
					&& w.endTime.localeCompare(getClassEnd(classNum) + ":00") >= 0;
			});
		}
		return wish;
	}
}

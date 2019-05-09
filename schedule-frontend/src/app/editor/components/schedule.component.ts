import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../auth/auth";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";
import {
	getCurrentYear, getCurrentSemester, getUserInitials,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareUsersByName, getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString
} from "../../common/models/functions";

export enum ClassFrequency {
	NONE,
	WEEKLY,
	NUMERATOR,
	DENOMINATOR,
	BIWEEKLY
}

class ClassCell {
	n: number;
	frequency: ClassFrequency;
	weekly: models.Class;
	numerator: models.Class;
	denominator: models.Class;
}

@Component({
	selector: "schedule-editor-schedule",
	templateUrl: "./schedule.component.html"
})
export class ScheduleComponent implements OnInit {
	private modalService: NgbModal;

	private authService: AuthService;

	private buildingService: services.BuildingService;
	private classService: services.ClassService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
	private groupService: services.GroupService;
	private planService: services.PlanService;
	private subjectService: services.SubjectService;
	private userService: services.UserService;
	private wishService: services.WishService;

	private dragPosition: number;
	private dragFrequency: number;
	private dragClass: models.Class;
	private dropPosition: number;
	private dropFrequency: number;
	private showDenominator: boolean;
	private allowDrop: Map<number, string> = new Map();

	currentUser: models.User;
	lecturers: models.User[] = [];
	lecturersClasses: Map<number, models.Class[]> = new Map();
	lecturersClassesAll: Map<number, ClassCell[]> = new Map();
	lecturerWishes: Map<number, models.Wish[]> = new Map();
	areLoaded: Map<number, boolean> = new Map();

	getLecturerInitials = getUserInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;
	getDayOfWeekNumber = getDayOfWeekNumber;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
	getClassroomsAsString = getClassroomsAsString;

	floor = Math.floor;

	constructor(
		modalService: NgbModal,
		authService: AuthService,
		buildingService: services.BuildingService,
		classService: services.ClassService,
		classroomService: services.ClassroomService,
		classroomTypeService: services.ClassroomTypeService,
		groupService: services.GroupService,
		planService: services.PlanService,
		subjectService: services.SubjectService,
		userService: services.UserService,
		wishService: services.WishService) {
		this.modalService = modalService;
		this.authService = authService;
		this.buildingService = buildingService;
		this.classService = classService;
		this.classroomService = classroomService;
		this.classroomTypeService = classroomTypeService;
		this.groupService = groupService;
		this.planService = planService;
		this.subjectService = subjectService;
		this.userService = userService;
		this.wishService = wishService;
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
			});
	}

	getClassFrequency(
		lecturer: models.User,
		day: number,
		num: number): ClassFrequency {
		let frequency: ClassFrequency = ClassFrequency.NONE;
		let classes = this.lecturersClasses.get(lecturer.id);

		if (classes) {
			classes = classes.filter(
				c => getDayOfWeekNumber(c.dayOfWeek) === day &&
					c.number === num);

			if (classes.length === 2) {
				frequency = ClassFrequency.BIWEEKLY;
			} else if (classes.length === 1) {
				const f = classes[0].frequency.toLowerCase();
				frequency = f === "щотижня"
					? ClassFrequency.WEEKLY
					: f === "по чисельнику"
						? ClassFrequency.NUMERATOR
						: ClassFrequency.DENOMINATOR;
			}
		}

		return frequency;
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

	startDrag(c: models.Class, position: number): void {
		this.dragPosition = position;
		this.dragFrequency = c.frequency === "Щотижня"
			? ClassFrequency.WEEKLY
			: c.frequency === "По чисельнику"
				? ClassFrequency.NUMERATOR
				: ClassFrequency.DENOMINATOR;
		this.dragClass = c;
		this.showDenominator = c.frequency !== "Щотижня";
	}

	canDrop(lecturer: models.User): boolean {
		return this.dragClass.subject.lecturers.map(l => l.id).includes(lecturer.id);
	}

	releaseDrop(c: models.Class): void {
		const copy = this.lecturersClassesAll;
		const frequencyDrop = c.frequency === "Щотижня" ? ClassFrequency.WEEKLY : this.dropFrequency;
		const frequencyDrag = c.frequency === "Щотижня" ? ClassFrequency.WEEKLY : this.dragFrequency;

		for (const lecturer of c.lecturers) {
			const classes = this.lecturersClassesAll.get(lecturer.id).map(cell => {
				if (cell.n === this.dropPosition
					&& (cell.n !== this.dragPosition || this.dragFrequency !== this.dropFrequency)) {

					c.dayOfWeek = getDayOfWeekName(this.getDay(this.dropPosition));
					c.number = this.getNumber(this.dropPosition);

					switch (frequencyDrop) {
						case ClassFrequency.WEEKLY:
							cell.weekly = c;
							cell.frequency = ClassFrequency.WEEKLY;
							break;
						case ClassFrequency.NUMERATOR:
							c.frequency = "По чисельнику";
							cell.numerator = c;
							cell.frequency = !cell.denominator
								? ClassFrequency.NUMERATOR
								: ClassFrequency.BIWEEKLY;
							break;
						case ClassFrequency.DENOMINATOR:
							c.frequency = "По знаменнику";
							cell.denominator = c;
							cell.frequency = !cell.numerator
								? ClassFrequency.DENOMINATOR
								: ClassFrequency.BIWEEKLY;
							break;
					}
				}

				if (cell.n === this.dragPosition
					&& (cell.n !== this.dropPosition || this.dragFrequency !== this.dropFrequency)) {
					switch (frequencyDrag) {
						case ClassFrequency.WEEKLY:
							cell.weekly = null;
							cell.frequency = ClassFrequency.NONE;
							break;
						case ClassFrequency.NUMERATOR:
							cell.numerator = null;
							cell.frequency = cell.denominator
								? ClassFrequency.DENOMINATOR
								: ClassFrequency.NONE;
							break;
						case ClassFrequency.DENOMINATOR:
							cell.denominator = null;
							cell.frequency = cell.numerator
								? ClassFrequency.NUMERATOR
								: ClassFrequency.NONE;
							break;
					}
				}

				return cell;
			});

			copy.set(lecturer.id, classes);
		}
		this.lecturersClassesAll = copy;
		this.showDenominator = false;
		this.dragClass = null;
	}

	addDropItem(event: models.Class, position: number, frequency: number): void {
		this.dropPosition = position;
		this.dropFrequency = frequency;
	}

	// editClassClicked(
	// 	frequency: ClassFrequency,
	// 	day: number,
	// 	num: number,
	// 	lecturer: models.User): void {
	// 	const modalRef = this.modalService.open(
	// 		ClassModalComponent, { size: "lg" });
	// 	const modal = modalRef.componentInstance as ClassModalComponent;
	// 	modal.contextLecturer = lecturer;

	// 	const frequencyName = frequency === ClassFrequency.WEEKLY
	// 		? "Щотижня"
	// 		: frequency === ClassFrequency.NUMERATOR
	// 			? "По чисельнику"
	// 			: "По знаменнику";

	// 	const reverseFrequencyName = frequency === ClassFrequency.NUMERATOR
	// 		? "По знаменнику"
	// 		: "По чисельнику";

	// 	const currentClass = this.getClass(lecturer, day, num, frequencyName);
	// 	modal.currentClass = {
	// 		id: currentClass.id,
	// 		number: currentClass.number,
	// 		frequency: currentClass.frequency,
	// 		dayOfWeek: currentClass.dayOfWeek,
	// 		year: getCurrentYear(),
	// 		semester: getCurrentSemester(),
	// 		type: currentClass.type,
	// 		classroomType: currentClass.classroomType,
	// 		subject: currentClass.subject,
	// 		classrooms: currentClass.classrooms.filter(() => true),
	// 		groups: currentClass.groups.filter(() => true),
	// 		lecturers: currentClass.lecturers.filter(() => true),
	// 	};

	// 	modal.isEditing = true;
	// 	modal.frequencySet = currentClass.frequency !== "Щотижня" &&
	// 		this.getClass(lecturer, day, num, reverseFrequencyName) as any;

	// 	modalRef.result.then(
	// 		(changedClass: models.Class | number) => {
	// 			if (typeof (changedClass) === "number") {
	// 				this.lecturersClasses.set(
	// 					lecturer.id,
	// 					this.lecturersClasses.get(lecturer.id).filter(
	// 						c => c.id !== changedClass));
	// 			} else if (changedClass) {
	// 				const c = this.lecturersClasses.get(lecturer.id).find(
	// 					lc => lc.id === changedClass.id);
	// 				c.frequency = changedClass.frequency;
	// 				c.type = changedClass.type;
	// 				c.classroomType = changedClass.classroomType;
	// 				c.subject = changedClass.subject;
	// 				c.classrooms = changedClass.classrooms;
	// 				c.groups = changedClass.groups;
	// 				c.lecturers = changedClass.lecturers;
	// 			}
	// 		},
	// 		() => { });
	// }

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

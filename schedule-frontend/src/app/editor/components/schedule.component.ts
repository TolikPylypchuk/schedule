import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../auth/auth";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";
import {
	getCurrentYear, getCurrentSemester,
	getUserInitials, getCurrentGroupName,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareUsersByName, getDayOfWeekName,
	getUsersAsString, getGroupsAsString, getClassroomsAsString,
	getShortName
} from "../../common/models/functions";

import {
	ClassCell, ClassFrequency, ViewToggle,
	frequencyFromString, frequencyToString
} from "./helpers";

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

	@ViewChild("scheduleTable") table: ElementRef;

	private fontSize = 1;

	private scrollLeft = false;
	private scrollRight = false;

	private dragPosition: number;
	private dragFrequency: number;
	private dragClass: models.Class;
	private dragViewObjectId: number;

	private dropPosition: number;
	private dropFrequency: number;
	private dropViewObjectId: number;

	currentUser: models.User;

	viewToggle = ViewToggle.LECTURERS;
	showOnlyFacultyLecturers = false;
	showDenominator = false;
	availableExpanded = false;

	lecturers: models.User[] = [];
	lecturersClasses: Map<number, models.Class[]> = new Map();
	lecturerWishes: Map<number, models.Wish[]> = new Map();

	groups: models.Group[] = [];
	groupsClasses: Map<number, models.Class[]> = new Map();

	viewObjects: models.User[] | models.Group[];
	viewClasses: Map<number, models.Class[]> = new Map();
	viewClassesAll: Map<number, ClassCell[]> = new Map();

	availableClasses: models.Class[] = [];
	areLoaded: Map<number, boolean> = new Map();

	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;
	getDayOfWeekNumber = getDayOfWeekNumber;
	getLecturersAsString = getUsersAsString;
	getGroupsAsString = getGroupsAsString;
	getClassroomsAsString = getClassroomsAsString;
	getShortName = getShortName;

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
				this.userService.getLecturersByFacultyIncludeRelated(user.department.faculty.id)
					.subscribe((lecturers: models.User[]) => {
						this.lecturers = lecturers.sort(compareUsersByName);
						this.viewObjects = this.lecturers;

						for (const lecturer of lecturers) {
							this.areLoaded.set(lecturer.id, false);
							this.classService.getClassesByLecturerAndYearAndSemester(
								lecturer.id,
								getCurrentYear(),
								getCurrentSemester())
								.subscribe((classes: models.Class[]) => {
									this.lecturersClasses.set(lecturer.id, classes);

									this.viewClasses = this.lecturersClasses;
									this.viewClassesAll.set(lecturer.id, this.getViewClasses(lecturer.id));
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

				this.groupService.getGroupsByFaculty(user.department.faculty.id)
					.subscribe((groups: models.Group[]) => {
						this.groups = groups;

						for (const group of groups) {
							this.areLoaded.set(group.id, false);
							this.classService.getClassesByGroupAndYearAndSemester(
								group.id,
								getCurrentYear(),
								getCurrentSemester())
								.subscribe((classes: models.Class[]) => {
									this.groupsClasses.set(group.id, classes);
									this.availableClasses = this.availableClasses.filter(c =>
										!(c.groups.find(x => x.id === group.id)
											&& classes.find(x => x.subject.id === c.subject.id
												&& x.type === c.type))
									);
								});
						}
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

	getLecturerInitials(viewObject: models.User): string {
		return getUserInitials(viewObject);
	}

	getGroupName(viewObject: models.Group): string {
		return getCurrentGroupName(viewObject);
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

	changeViewType() {
		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				this.viewObjects = this.groups;
				this.viewClasses = this.groupsClasses;
				break;
			case ViewToggle.LECTURERS:
				this.viewObjects = this.lecturers;
				this.viewClasses = this.lecturersClasses;
				break;
		}

		const viewClasses = new Map();
		for (const viewObject of this.viewObjects) {
			viewClasses.set(viewObject.id, this.getViewClasses(viewObject.id));
		}

		this.viewClassesAll = viewClasses;
	}

	getViewClasses(
		viweObjectId: number): ClassCell[] | undefined {

		const classes = this.viewClasses.get(viweObjectId);

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

	getViewObjectName(viewObject: models.User | models.Group): string {
		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				return getCurrentGroupName(viewObject as models.Group);
			case ViewToggle.LECTURERS:
				return getUserInitials(viewObject as models.User);
			default:
				return "";
		}
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

	getDay(n: number): number {
		return Math.floor(n / 9 + 1);
	}

	getNumber(n: number): number {
		return n % 9 + 1;
	}

	getArrayOfNumbers(num: number): number[] {
		return Array.apply(null, { length: num }).map(Number.call, Number);
	}

	checkFields(c: models.Class): boolean {
		return c.dayOfWeek
			&& c.number > 0
			&& c.groups !== null && c.groups.length > 0
			&& c.lecturers !== null && c.lecturers.length > 0
			&& c.classrooms !== null && c.classrooms.length > 0;
	}

	startDrag(c: models.Class, viewObject: models.User | models.Group, position: number): void {
		this.dragPosition = position;
		this.dragFrequency = c.frequency === "Щотижня"
			? ClassFrequency.WEEKLY
			: c.frequency === "По чисельнику"
				? ClassFrequency.NUMERATOR
				: ClassFrequency.DENOMINATOR;
		this.dragClass = c;
		this.dragViewObjectId = viewObject ? viewObject.id : null;
		this.showDenominator = c.frequency !== "Щотижня";
	}

	canDrop(viewObjectId: number, dropPsition: number, dropFrequency: number): boolean {
		return !this.dragClass
			|| this.viewToggle === ViewToggle.GROUPS
			&& !!this.dragClass.groups.find(l => l.id === viewObjectId)
			|| this.viewToggle === ViewToggle.LECTURERS
			&& !!this.dragClass.subject.lecturers.find(l => l.id === viewObjectId)
			&& !this.dragClass.lecturers.find(l =>
				this.lecturersClasses.get(l.id).find(c => getDayOfWeekNumber(c.dayOfWeek) === this.getDay(dropPsition) &&
					c.number === this.getNumber(dropPsition) &&
					frequencyFromString(c.frequency) === dropFrequency) as any
			)
			&& !this.dragClass.groups.find(g =>
				this.groupsClasses.get(g.id).find(c => getDayOfWeekNumber(c.dayOfWeek) === this.getDay(dropPsition) &&
					c.number === this.getNumber(dropPsition) &&
					frequencyFromString(c.frequency) === dropFrequency) as any
			);
	}

	releaseDrop(c: models.Class): void {
		if (!this.canDrop(this.dropViewObjectId, this.dragPosition, this.dropFrequency)) {
			this.showDenominator = false;
			this.dragClass = null;
			this.dragViewObjectId = null;
			this.dropViewObjectId = null;

			return;
		}

		let updated = [];

		c = this.updateDroppedClass(c);

		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				updated = this.updateForGroups(c);
				break;
			case ViewToggle.LECTURERS:
				updated = this.updateForLecturers(c);
				break;
		}

		const viewClassesAll = this.viewClassesAll;

		for (const updatedObject of updated) {
			viewClassesAll.set(updatedObject.id, this.getViewClasses(updatedObject.id));
		}

		this.viewClassesAll = viewClassesAll;

		this.showDenominator = false;
		this.dragClass = null;
		this.dragViewObjectId = null;
		this.dropViewObjectId = null;
	}

	addDropItem(c: models.Class, viewObject: models.User | models.Group, position: number, frequency: number): void {
		this.dropPosition = position;
		this.dropFrequency = position !== -1
			? frequency
			: frequencyFromString(c.frequency);
		this.dropViewObjectId = viewObject ? viewObject.id : null;
	}

	updateDroppedClass(c: models.Class): models.Class {
		if (this.dropPosition !== -1) {
			c.dayOfWeek = getDayOfWeekName(this.getDay(this.dropPosition));
			c.number = this.getNumber(this.dropPosition);
			c.frequency = frequencyToString(this.dropFrequency);
		}

		return c;
	}

	updateForGroups(c: models.Class): models.Group[] {
		this.updateAssosiated(c, c.groups);

		const action = !c.id
			? this.classService.addClass(c)
			: c.lecturers.length > 0
				? this.classService.updateClass(c)
				: this.classService.deleteClass(c.id);

		action.subscribe();
		action.connect();

		return c.groups;
	}

	updateForLecturers(c: models.Class): models.User[] {
		let lecturers = c.lecturers;

		if (this.dragPosition === -1) {
			lecturers = [this.lecturers.find(l => l.id === this.dropViewObjectId)];
			c.lecturers = lecturers;

			const classes = this.lecturersClasses.get(this.dropViewObjectId);
			classes.push(c);
			this.lecturersClasses.set(this.dropViewObjectId, classes);

			this.availableClasses = this.availableClasses.filter(cl => cl !== c);
		} else if (this.dropPosition === -1) {
			c.lecturers = c.lecturers.filter(l => l.id !== this.dragViewObjectId);

			this.lecturersClasses.set(
				this.dragViewObjectId,
				this.lecturersClasses.get(this.dragViewObjectId).filter(cl => cl.id !== c.id));

			if (c.lecturers.length === 0) {
				c.dayOfWeek = null;
				c.number = 0;
				c.frequency = frequencyToString(this.dragFrequency);
				this.availableClasses.push(c);
			}
		} else if (this.dragViewObjectId !== this.dropViewObjectId) {
			lecturers.push(this.lecturers.find(l => l.id === this.dropViewObjectId));
			c.lecturers = lecturers.filter(l => l.id !== this.dragViewObjectId);
			this.lecturersClasses.set(
				this.dragViewObjectId,
				this.lecturersClasses.get(this.dragViewObjectId).filter(cl => cl.id !== c.id));

			const classes = this.lecturersClasses.get(this.dropViewObjectId);
			classes.push(c);
			this.lecturersClasses.set(
				this.dropViewObjectId,
				classes);
		}

		const action = !c.id
			? this.classService.addClass(c)
			: c.lecturers.length > 0
				? this.classService.updateClass(c)
				: this.classService.deleteClass(c.id);

		action.subscribe();
		action.connect();


		this.viewClasses = this.lecturersClasses;

		this.updateAssosiated(c, c.lecturers);
		this.lecturersClasses = this.viewClasses;

		return lecturers;
	}

	updateAssosiated(c: models.Class, assosiated: models.EntityBase[]): void {
		let groups = [];
		let lecturers = [];

		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				groups = assosiated;
				lecturers = c.lecturers;
				break;
			case ViewToggle.LECTURERS:
				groups = c.groups;
				lecturers = assosiated;
				break;
		}

		for (const assosiate of groups) {
			this.groupsClasses.set(
				assosiate.id,
				this.groupsClasses.get(assosiate.id).map(cl => cl.id === c.id ? c : cl));
		}

		for (const assosiate of lecturers) {
			this.lecturersClasses.set(
				assosiate.id,
				this.lecturersClasses.get(assosiate.id).map(cl => cl.id === c.id ? c : cl));
		}
	}

	editClassClicked(
		classObject: models.Class,
		lecturer: models.User): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		modal.contextLecturer = lecturer;
		modal.contextGroup = null;

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
		modal.wish = wish;

		switch (this.viewToggle) {
			case ViewToggle.GROUPS:
				break;
			case ViewToggle.LECTURERS:
				modal.contextLecturer = lecturer;
				modal.currentClass.lecturers = [lecturer];
				break;
		}

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

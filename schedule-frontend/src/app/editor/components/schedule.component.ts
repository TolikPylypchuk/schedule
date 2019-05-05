import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../auth/auth";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";
import {
	getCurrentYear, getCurrentSemester, getUserInitials,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareUsersByName, getDayOfWeekName
} from "../../common/models/functions";

export enum ClassFrequency {
	NONE,
	WEEKLY,
	NUMERATOR,
	DENOMINATOR,
	BIWEEKLY
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

	currentUser: models.User;
	lecturers: models.User[] = [];
	lecturersClasses: Map<number, models.Class[]> = new Map();
	lecturerWishes: Map<number, models.Wish[]> = new Map();

	getLecturerInitials = getUserInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;

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
		this.authService.getCurrentUser()
			.subscribe((user: models.User) => {
				debugger;
				this.currentUser = user;

				this.userService.getLecturersByFaculty(user.department.faculty.id)
					.subscribe((lecturers: models.User[]) => {
						this.lecturers = lecturers.sort(compareUsersByName);

						for (const lecturer of lecturers) {
							this.classService.getClassesByLecturerAndYearAndSemester(
								lecturer.id,
								getCurrentYear(),
								getCurrentSemester())
								.subscribe((classes: models.Class[]) =>
									this.lecturersClasses.set(lecturer.id, classes));
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

	getArrayOfNumbers(num: number): number[] {
		return Array.apply(null, {length: num}).map(Number.call, Number);
	}

	editClassClicked(
		frequency: ClassFrequency,
		day: number,
		num: number,
		lecturer: models.User): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		modal.contextLecturer = lecturer;

		const frequencyName = frequency === ClassFrequency.WEEKLY
			? "Щотижня"
			: frequency === ClassFrequency.NUMERATOR
				? "По чисельнику"
				: "По знаменнику";

		const reverseFrequencyName = frequency === ClassFrequency.NUMERATOR
			? "По знаменнику"
			: "По чисельнику";

		const currentClass = this.getClass(lecturer, day, num, frequencyName);
		modal.currentClass = {
			id: currentClass.id,
			number: currentClass.number,
			frequency: currentClass.frequency,
			dayOfWeek: currentClass.dayOfWeek,
			year: getCurrentYear(),
			semester: getCurrentSemester(),
			type: currentClass.type,
			classroomType: currentClass.classroomType,
			subject: currentClass.subject,
			classrooms: currentClass.classrooms.filter(() => true),
			groups: currentClass.groups.filter(() => true),
			lecturers: currentClass.lecturers.filter(() => true),
		};

		modal.isEditing = true;
		modal.frequencySet = currentClass.frequency !== "Щотижня" &&
			this.getClass(lecturer, day, num, reverseFrequencyName) as any;

		modalRef.result.then(
			(changedClass: models.Class | number) => {
				if (typeof(changedClass) === "number") {
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
		modal.currentClass.lecturers = [ lecturer ];
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

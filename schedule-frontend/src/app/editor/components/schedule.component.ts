import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ClassModalComponent } from "./class-modal.component";

import { AuthService } from "../../auth/auth";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";
import {
	getCurrentYear, getCurrentSemester, getLecturerInitials,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareLecturersByName, getDayOfWeekName
} from "../../common/models/functions";

interface ClassInfo {
	c: models.Class,
	classrooms: models.Classroom[],
	groups: models.Group[]
}

export enum ClassFrequency {
	NONE,
	WEEKLY,
	NUMERATOR,
	DENOMINATOR,
	BOTH
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
	lecturersClasses: Map<number, ClassInfo[]> = new Map();

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
				this.currentUser = user;

				this.userService.getLecturersByFaculty(user.faculty.id)
					.subscribe((lecturers: models.User[]) =>
						this.initLecturers(lecturers));
			});
	}

	getClassFrequency(
		lecturer: models.User,
		day: number,
		num: number): ClassFrequency {
		let frequency: ClassFrequency = ClassFrequency.NONE;
		let infoArray = this.lecturersClasses.get(lecturer.id);

		if (infoArray) {
			infoArray = infoArray.filter(
				info => getDayOfWeekNumber(info.c.dayOfWeek) === day &&
						info.c.number === num);

			if (infoArray.length === 2) {
				frequency = ClassFrequency.BOTH;
			} else if (infoArray.length === 1) {
				const f = infoArray[0].c.frequency.toLowerCase();
				frequency = f === "щотижня"
					? ClassFrequency.WEEKLY
					: f === "по чисельнику"
						? ClassFrequency.NUMERATOR
						: ClassFrequency.DENOMINATOR;
			}
		}

		return frequency;
	}

	getClassInfo(
		lecturer: models.User,
		day: number,
		num: number,
		frequency: string): ClassInfo {
		let infoArray = this.lecturersClasses.get(lecturer.id);
		return infoArray.find(
			info => getDayOfWeekNumber(info.c.dayOfWeek) === day &&
					info.c.number === num &&
					info.c.frequency.toLowerCase() === frequency);
	}

	getArrayOfNumbers(num: number): number[] {
		return Array.apply(null, {length: num}).map(Number.call, Number);
	}

	addClassClicked(
		frequency: ClassFrequency,
		day: number,
		num: number,
		lecturer: models.User): void {
		const modalRef = this.modalService.open(
			ClassModalComponent, { size: "lg" });
		const modal = modalRef.componentInstance as ClassModalComponent;
		modal.currentClass.frequency = frequency == ClassFrequency.NONE
			? null
			: frequency == ClassFrequency.NUMERATOR
				? "По чисельнику"
				: "По знаменнику";
		modal.frequencySet = frequency != ClassFrequency.NONE;
		modal.currentClass.dayOfWeek = getDayOfWeekName(day);
		modal.currentClass.number = num;
		modal.contextLecturer = lecturer;
		modal.currentClass.lecturers = [ lecturer ];
	}

	getLecturerInitials = getLecturerInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;

	floor = Math.floor;

	private initLecturers(lecturers: models.User[]): void {
		this.lecturers = lecturers.sort(compareLecturersByName);

		for (let lecturer of lecturers) {
			this.classService.getClassesByLecturerAndYearAndSemester(
				lecturer.id,
				getCurrentYear(),
				getCurrentSemester())
				.subscribe((classes: models.Class[]) => {
					let infoArray: ClassInfo[] = [];

					this.lecturersClasses.set(lecturer.id, infoArray);

					for (let c of classes) {
						Observable.forkJoin([
								this.classroomService.getClassroomsByClass(c.id),
								this.groupService.getGroupsByClass(c.id)
							],
							(classrooms: models.Classroom[],
							 groups: models.Group[]): ClassInfo => {
								return {
									c: c,
									classrooms: classrooms,
									groups: groups
								}
							})
							.subscribe((info: ClassInfo) => infoArray.push(info));
					}
				});
		}
	}
}

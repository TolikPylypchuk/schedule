import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import * as models from '../models/models';

import * as services from "../services/services";
import { AuthService } from "../auth/auth.service";

import {
	getCurrentYear, getCurrentSemester, getLecturerInitials,
	getClassStart, getClassEnd, getDayOfWeekNumber,
	compareLecturersByName
} from '../models/functions';

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
	selector: "schedule-admin-schedule",
	templateUrl: "./schedule.component.html"
})
export class ScheduleComponent implements OnInit {
	private authService: AuthService;
	private buildingService: services.BuildingService;
	private classService: services.ClassService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
	private groupService: services.GroupService;
	private lecturerService: services.UserService;
	private planService: services.PlanService;
	private subjectService: services.SubjectService;
	private wishService: services.WishService;

	currentUser: models.Lecturer;
	lecturers: models.Lecturer[] = [];
	lecturersClasses: Map<number, ClassInfo[]> = new Map();

	constructor(
		authService: AuthService,
		buildingService: services.BuildingService,
		classService: services.ClassService,
		classroomService: services.ClassroomService,
		classroomTypeService: services.ClassroomTypeService,
		groupService: services.GroupService,
		lecturerService: services.UserService,
		planService: services.PlanService,
		subjectService: services.SubjectService,
		wishService: services.WishService) {
		this.authService = authService;
		this.buildingService = buildingService;
		this.classService = classService;
		this.classroomService = classroomService;
		this.classroomTypeService = classroomTypeService;
		this.groupService = groupService;
		this.lecturerService = lecturerService;
		this.planService = planService;
		this.subjectService = subjectService;
		this.wishService = wishService;
	}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();

		this.lecturerService.getLecturersByFaculty(this.currentUser.faculty.id)
			.subscribe((lecturers: models.Lecturer[]) => {
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
			});
	}

	getClassFrequency(
		lecturer: models.Lecturer,
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
		lecturer: models.Lecturer,
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

	getLecturerInitials = getLecturerInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;

	floor = Math.floor;
}

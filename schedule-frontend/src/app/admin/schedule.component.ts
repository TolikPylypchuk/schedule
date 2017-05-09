import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";

import * as models from '../models/models';

import * as services from "../services/services";

import {
	getCurrentYear, getCurrentSemester, getLecturerInitials,
	getClassStart, getClassEnd, groupBy, getDayOfWeekNumber
} from '../models/functions';

interface ClassInfo {
	c: models.Class,
	classrooms: models.Classroom[],
	groups: models.Group[]
}

interface LecturerClasses {
	lecturer?: models.Lecturer,
	classes?: {
		day?: string,
		classes?: ClassInfo[]
	}[]
}

enum ClassFrequency {
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
	private authService: services.AuthService;
	private buildingService: services.BuildingService;
	private classService: services.ClassService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
	private groupService: services.GroupService;
	private lecturerService: services.LecturerService;
	private planService: services.PlanService;
	private subjectService: services.SubjectService;
	private wishService: services.WishService;

	currentUser: models.Lecturer;
	lecturersClasses: LecturerClasses[] = [];

	constructor(
		authService: services.AuthService,
		buildingService: services.BuildingService,
		classService: services.ClassService,
		classroomService: services.ClassroomService,
		classroomTypeService: services.ClassroomTypeService,
		groupService: services.GroupService,
		lecturerService: services.LecturerService,
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
				for (let lecturer of lecturers) {
					this.classService.getClassesByLecturerAndYearAndSemester(
						lecturer.id,
						getCurrentYear(),
						getCurrentSemester())
						.subscribe((classes: models.Class[]) => {
							const groupedClasses = groupBy(classes, "dayOfWeek");

							let lecturerClasses: LecturerClasses = {
								lecturer: lecturer,
								classes: []
							};

							this.lecturersClasses.push(lecturerClasses);

							for (let group of groupedClasses) {
								let day = {
									day: group.key as string,
									classes: []
								};

								lecturerClasses.classes.push(day);

								for (let c of group.items) {
									Observable.forkJoin([
											this.classroomService.getClassroomsByClass(c.id),
											this.groupService.getGroupsByClass(c.id)
										],
										(classrooms: models.Classroom[],
										 groups: models.Group[]) => {
											day.classes.push({
												c: c,
												classrooms: classrooms,
												groups: groups
											});
										});
								}
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
		const lc = this.lecturersClasses.find(lc => lc.lecturer === lecturer);

		if (lc) {
			const cd = lc.classes.find(c => getDayOfWeekNumber(c.day) === day);

			if (cd) {
				const cns = cd.classes.filter(c => c.c.number === num);

				if (cns.length === 2) {
					frequency = ClassFrequency.BOTH;
				} else if (cns.length === 1) {
					const f = cns[0].c.frequency.toLowerCase();
					frequency = f === "щотижня"
						? ClassFrequency.WEEKLY
						: f === "по чисельнику"
							? ClassFrequency.NUMERATOR
							: ClassFrequency.DENOMINATOR;
				}
			}
		}

		return frequency;
	}

	getArrayOfNumbers(num: number): number[] {
		return Array.apply(null, {length: num}).map(Number.call, Number);
	}

	getLecturerInitials = getLecturerInitials;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
}

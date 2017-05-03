import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import {
	ClassService, ClassroomService, GroupService,
	LecturerService, SubjectService
} from "../services/services";

import {
	getCurrentYear, getCurrentSemester,
	getLecturerInitials,
	getClassStart, getClassEnd,
	getDayOfWeekName, getDayOfWeekNumber,
	getFrequencyName, getClassType,
	getGroupsString, getClassroomsString
} from "../models/functions";

import { Class, Classroom, Group, Lecturer, Subject } from "../models/models";

interface ClassInfo {
	day: string;
	number: number;
	start: string;
	end: string;
	frequency: string;
	subject: string;
	type: string;
	classrooms: string;
	groups: string
}

@Component({
	selector: "schedule-lecturer",
	templateUrl: "./lecturer.component.html"
})
export class LecturerComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private lecturerService: LecturerService;
	private subjectService: SubjectService;

	private currentLecturer: string;
	private classes: ClassInfo[] = [];

	isLoaded = false;

	constructor(
		route: ActivatedRoute,
		router: Router,
		classService: ClassService,
		classroomService: ClassroomService,
		groupService: GroupService,
		lecturerService: LecturerService,
		subjectService: SubjectService) {
		this.route = route;
		this.router = router;

		this.classService = classService;
		this.classroomService = classroomService;
		this.groupService = groupService;
		this.lecturerService = lecturerService;
		this.subjectService = subjectService;
	}

	ngOnInit(): void {
		const currentYear = getCurrentYear();
		const semester = getCurrentSemester();

		this.route.params
			.switchMap((params: Params) => this.lecturerService.getLecturer(+params["id"]))
			.subscribe((lecturer: Lecturer) => {
				this.currentLecturer = getLecturerInitials(lecturer);

				this.classService.getClassesByLecturerAndYearAndSemester(
					lecturer.id, currentYear, semester)
					.subscribe((classes: Class[]) => {
						let observables: Observable<any>[] = [];

						if (classes.length === 0) {
							this.isLoaded = true;
						} else {
							for (let c of classes) {
								observables.push(Observable.forkJoin([
										this.subjectService.getSubjectByClass(c.id),
										this.classroomService.getClassroomsByClass(c.id),
										this.groupService.getGroupsByClass(c.id)
									],
									(s: Subject, cr: Classroom[], g: Group[]): ClassInfo => {
										return {
											day: getDayOfWeekName(c.dayOfWeek),
											number: c.number,
											start: getClassStart(c),
											end: getClassEnd(c),
											frequency: getFrequencyName(c.frequency),
											subject: s.name,
											type: getClassType(c.type),
											classrooms: getClassroomsString(cr),
											groups: getGroupsString(g)
										};
									}));
							}

							Observable.forkJoin(
								observables,
								(...args: ClassInfo[]): ClassInfo[] => args)
								.subscribe((tempClasses: ClassInfo[]) => {
									tempClasses.sort(
										(c1: ClassInfo, c2: ClassInfo) => {
											const day1 = getDayOfWeekNumber(c1.day);
											const day2 = getDayOfWeekNumber(c2.day);

											let result = day1 > day2
												? 1
												: day1 < day2 ? -1 : 0;

											if (result === 0) {
												result = c1.number > c2.number
													? 1
													: c1.number < c2.number ? -1 : 0;

												if (result === 0) {
													result = c1.frequency === getFrequencyName("NUMERATOR")
														? -1
														: 1;
												}
											}

											return result;
										});

									this.classes = tempClasses;
									this.isLoaded = true;
								});
						}
					});
			});
	}
}

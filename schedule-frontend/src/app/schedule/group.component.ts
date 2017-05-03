import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import {
	ClassService, ClassroomService, GroupService,
	LecturerService, SubjectService
} from "../services/services";

import {
	getCurrentYear, getCurrentSemester,
	getCurrentGroupName,
	getClassStart, getClassEnd,
	getDayOfWeekName, getDayOfWeekNumber,
	getFrequencyName, getClassType,
	getLecturersString, getClassroomsString
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
	lecturers: string
}

@Component({
	selector: "schedule-group",
	templateUrl: "./group.component.html"
})
export class GroupComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private lecturerService: LecturerService;
	private subjectService: SubjectService;

	private currentGroup: string;
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
			.switchMap((params: Params) => this.groupService.getGroup(+params["id"]))
			.subscribe((group: Group) => {
				this.currentGroup = getCurrentGroupName(group);

				this.classService.getClassesByGroupAndYearAndSemester(
					group.id, currentYear, semester)
					.subscribe((classes: Class[]) => {
						let observables: Observable<any>[] = [];

						for (let c of classes) {
							observables.push(Observable.forkJoin([
									this.subjectService.getSubjectByClass(c.id),
									this.classroomService.getClassroomsByClass(c.id),
									this.lecturerService.getLecturersByClass(c.id)
								],
								(s: Subject, cr: Classroom[], l: Lecturer[]): ClassInfo => {
									return {
										day: getDayOfWeekName(c.dayOfWeek),
										number: c.number,
										start: getClassStart(c),
										end: getClassEnd(c),
										frequency: getFrequencyName(c.frequency),
										subject: s.name,
										type: getClassType(c.type),
										classrooms: getClassroomsString(cr),
										lecturers: getLecturersString(l)
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
											result = c1.number < c1.number
												? 1
												: c1.number > c1.number ? -1 : 0;
										}

										return result;
									});

								this.classes = tempClasses;
								this.isLoaded = true;
							});
					});
			});
	}
}

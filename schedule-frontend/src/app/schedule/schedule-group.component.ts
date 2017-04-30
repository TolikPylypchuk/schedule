import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Observable } from "rxjs/Observable";

import {
	ClassService, ClassroomService, GroupService,
	LecturerService, SubjectService,
	getCurrentYear, getCurrentSemester,
	getCurrentGroupName,
	getClassStart, getClassEnd,
	getDayOfWeekName, getFrequencyName,
	getLecturersString, getClassroomsString
} from "../services/services";

import { Class, Classroom, Group, Lecturer, Subject } from "../models/models";

interface ClassInfo {
	c?: Class;
	subject?: Subject;
	classrooms?: Classroom[];
	lecturers?: Lecturer[]
}

@Component({
	selector: "schedule-group",
	templateUrl: "./schedule-group.component.html"
})
export class ScheduleGroupComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private lecturerService: LecturerService;
	private subjectService: SubjectService;

	private currentGroup: Group;
	private classes: Map<Class, ClassInfo>;

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

		this.classes = new Map();
	}

	ngOnInit(): void {
		const currentYear = getCurrentYear();
		const semester = getCurrentSemester();

		this.route.params
			.switchMap((params: Params) => this.groupService.getGroup(+params["id"]))
			.subscribe((group: Group) => {
				this.currentGroup = group;

				this.classService.getClassesByGroupAndYearAndSemester(
					group.id, currentYear, semester)
					.subscribe(classes => {
						let observables: Observable<any>[] = [];

						for (let c of classes) {
							observables.push(Observable.forkJoin([
									this.subjectService.getSubjectByClass(c.id),
									this.classroomService.getClassroomsByClass(c.id),
									this.lecturerService.getLecturersByClass(c.id)
								],
								(s: Subject, cr: Classroom[], l: Lecturer[]): ClassInfo => {
									return {
										c: c,
										subject: s,
										classrooms: cr,
										lecturers: l
									};
								}));
						}

						Observable.forkJoin(
							observables,
							(...args: ClassInfo[]): Map<Class, ClassInfo> => {
								let tempClasses = new Map();

								for (let arg of args) {
									tempClasses.set(arg.c, arg);
								}

								return tempClasses;
							})
							.subscribe((tempClasses: Map<Class, ClassInfo>) =>
								tempClasses.forEach(
									(value, key) => this.classes.set(key, value)));
					});
			});
	}

	getCurrentGroupName = getCurrentGroupName;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;
	getFrequencyName = getFrequencyName;
	getLecturersString = getLecturersString;
	getClassroomsString = getClassroomsString;
}

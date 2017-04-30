import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";

import {
	ClassService, ClassroomService, GroupService,
	LecturerService, SubjectService,
	getCurrentYear, getCurrentSemester,
	getCurrentGroupName,
	getClassStart, getClassEnd,
	getDayOfWeekName, getFrequencyName,
	getGroupsString, getClassroomsString,
	getLecturerInitials
} from "../services/services";

import { Class, Classroom, Group, Lecturer, Subject } from "../models/models";

@Component({
	selector: "schedule-lecturer",
	templateUrl: "./schedule-lecturer.component.html"
})
export class ScheduleLecturerComponent implements OnInit {
	private route: ActivatedRoute;
	private router: Router;

	private classService: ClassService;
	private classroomService: ClassroomService;
	private groupService: GroupService;
	private lecturerService: LecturerService;
	private subjectService: SubjectService;

	private currentLecturer: Lecturer;
	private classes: Map<Class, {
		subject?: Subject,
		classrooms?: Classroom[],
		groups?: Group[]
	}>;

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
			.switchMap((params: Params) => this.lecturerService.getLecturer(+params["id"]))
			.subscribe((lecturer: Lecturer) => {
				this.currentLecturer = lecturer;

				this.classService.getClassesByLecturerAndYearAndSemester(
					lecturer.id, currentYear, semester)
					.subscribe(classes => {
						for (let c of classes) {
							this.classes.set(c, {});

							this.subjectService.getSubjectByClass(c.id)
								.subscribe(subject =>
									this.classes.get(c).subject = subject);

							this.classroomService.getClassroomsByClass(c.id)
								.subscribe(classrooms =>
									this.classes.get(c).classrooms = classrooms);

							this.groupService.getGroupsByClass(c.id)
								.subscribe(groups =>
									this.classes.get(c).groups = groups);
						}
					});
			});
	}
	/*
	getSortedClasses(): {
		c: Class,
		subject?: Subject,
		classrooms?: Classroom[],
		groups?: Group[] }[] {
		let result: any[] = [];
		for (let c of this.classes.keys()) {

		}
	}
	*/
	getCurrentGroupName = getCurrentGroupName;
	getClassStart = getClassStart;
	getClassEnd = getClassEnd;
	getDayOfWeekName = getDayOfWeekName;
	getFrequencyName = getFrequencyName;
	getGroupsString = getGroupsString;
	getClassroomsString = getClassroomsString;
	getLecturerInitials = getLecturerInitials;
}

import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";

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
	private classes: Map<Class, {
		subject?: Subject,
		classrooms?: Classroom[],
		lecturers?: Lecturer[]
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
			.switchMap((params: Params) => this.groupService.getGroup(+params["id"]))
			.subscribe((group: Group) => {
				this.currentGroup = group;

				this.classService.getClassesByGroupAndYearAndSemester(
					group.id, currentYear, semester)
					.subscribe(classes => {
						for (let c of classes) {
							this.classes.set(c, {});

							this.subjectService.getSubjectByClass(c.id)
								.subscribe(subject =>
									this.classes.get(c).subject = subject);

							this.classroomService.getClassroomsByClass(c.id)
								.subscribe(classrooms =>
									this.classes.get(c).classrooms = classrooms);

							this.lecturerService.getLecturersByClass(c.id)
								.subscribe(lecturers =>
									this.classes.get(c).lecturers = lecturers);
						}
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

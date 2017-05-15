import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";

import {
	getCurrentYear, getCurrentSemester,
	getLecturerInitials, getGroupsAsString,
	getCurrentGroupName, getLecturersAsString,
	getDayOfWeekNumber
} from "../../common/models/functions";
import { AuthService } from "../../auth/services/auth.service";

interface ClassInfo extends models.Class {
	building: models.Building;
}

@Component({
	selector: "schedule-editor-class-modal",
	templateUrl: "./class-modal.component.html"
})
export class ClassModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private authService: AuthService;
	private buildingService: services.BuildingService;
	private classService: services.ClassService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
	private groupService: services.GroupService;
	private planService: services.PlanService;
	private subjectService: services.SubjectService;
	private userService: services.UserService;

	currentEditor: models.User = null;

	currentClass: ClassInfo = {
		number: 0,
		frequency: null,
		dayOfWeek: null,
		year: getCurrentYear(),
		semester: getCurrentSemester(),
		type: null,
		classroomType: null,
		subject: null,
		classrooms: [],
		groups: [],
		lecturers: [],
		building: null
	};

	contextLecturer: models.User;
	buildings: models.Building[] = [];
	subjects: models.Subject[] = [];
	classroomTypes: models.ClassroomType[] = [];
	availableClassrooms: models.Classroom[] = [];
	availableGroups: models.Group[] = [];
	availableLecturers: models.User[] = [];

	constructor(
		activeModal: NgbActiveModal,
		authService: AuthService,
		buildingService: services.BuildingService,
		classService: services.ClassService,
		classroomService: services.ClassroomService,
		classroomTypeService: services.ClassroomTypeService,
		groupService: services.GroupService,
		planService: services.PlanService,
		subjectService: services.SubjectService,
		userService: services.UserService) {
		this.activeModal = activeModal;
		this.authService = authService;
		this.buildingService = buildingService;
		this.classService = classService;
		this.classroomService = classroomService;
		this.classroomTypeService = classroomTypeService;
		this.groupService = groupService;
		this.planService = planService;
		this.subjectService = subjectService;
		this.userService = userService;
	}

	ngOnInit(): void {
		this.subjectService.getSubjectsByLecturer(
			this.currentClass.lecturers[0].id)
			.subscribe((subjects: models.Subject[]) => this.subjects = subjects);

		this.buildingService.getBuildings()
			.subscribe((buildings: models.Building[]) => this.buildings = buildings);

		this.classroomTypeService.getClassroomTypes()
			.subscribe((types: models.ClassroomType[]) => this.classroomTypes = types);

		this.authService.getCurrentUser()
			.subscribe((user: models.User) => this.currentEditor = user);
	}

	subjectSelected(): void {
		if (!this.currentClass.subject) {
			return;
		}

		this.currentClass.groups = [];

		this.groupService.getAvailableGroups(
			this.currentEditor.faculty.id,
			this.currentClass.subject.id,
			getDayOfWeekNumber(this.currentClass.dayOfWeek),
			this.currentClass.number)
			.subscribe((groups: models.Group[]) =>
				this.availableGroups = groups);

		this.userService.getAvailableLecturers(
			this.currentEditor.faculty.id,
			this.currentClass.subject.id,
			getDayOfWeekNumber(this.currentClass.dayOfWeek),
			this.currentClass.number)
			.subscribe((lecturers: models.User[]) =>
				this.availableLecturers = lecturers.filter(
					l => l.id !== this.contextLecturer.id));
	}

	classTypeSelected(): void {

	}

	classroomTypeSelected(): void {

	}

	buildingSelected(): void {

	}

	groupChecked(group: models.Group): void {
		if (this.currentClass.groups.includes(group)) {
			this.currentClass.groups = this.currentClass.groups.filter(
				g => g.id !== group.id);
		} else {
			this.currentClass.groups.push(group);
		}
	}

	lecturerChecked(lecturer: models.User): void {
		if (this.currentClass.lecturers.includes(lecturer)) {
			this.currentClass.lecturers = this.currentClass.lecturers.filter(
				l => l.id !== lecturer.id);
		} else {
			this.currentClass.lecturers.push(lecturer);
		}
	}

	getCurrentGroupName = getCurrentGroupName;
	getGroupsAsString = getGroupsAsString;
	getLecturersAsString = getLecturersAsString;
	getLecturerInitials = getLecturerInitials;
}

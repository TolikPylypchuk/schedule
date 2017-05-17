import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";

import {
	getCurrentYear, getCurrentSemester,
	getLecturerInitials, getGroupsAsString,
	getCurrentGroupName, getLecturersAsString,
	getDayOfWeekNumber, getClassroomsAsString
} from "../../common/models/functions";
import { AuthService } from "../../auth/services/auth.service";

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

	currentClass: models.Class = {
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
		lecturers: []
	};

	contextLecturer: models.User;
	availableBuildings: models.Building[] = [];
	subjects: models.Subject[] = [];
	classroomTypes: models.ClassroomType[] = [];
	availableClassrooms: {
		building: models.Building;
		classrooms: models.Classroom[];
	}[] = [];
	availableGroups: models.Group[] = [];
	availableLecturers: models.User[] = [];
	frequencySet: boolean;
	isEditing: boolean;
	error = true;
	errorText: string = null;

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
			.subscribe((subjects: models.Subject[]) => {
				this.subjects = subjects;

				if (this.isEditing) {
					this.currentClass.subject = subjects.find(
						s => s.id === this.currentClass.subject.id);

					this.setGroupsAndLecturers();
				}
			});

		this.classroomTypeService.getClassroomTypes()
			.subscribe((types: models.ClassroomType[]) => {
				this.classroomTypes = types;

				if (this.isEditing) {
					this.currentClass.classroomType = types.find(
						t => t.id === this.currentClass.classroomType.id);
				}

				this.buildingService.getBuildings()
					.subscribe((buildings: models.Building[]) => {
						this.availableBuildings = buildings;

						if (this.isEditing) {
							this.setClassrooms();
						}
					});
			});

		this.authService.getCurrentUser()
			.subscribe((user: models.User) => this.currentEditor = user);
	}

	setGroupsAndLecturers(): void {
		this.availableGroups = [];
		this.availableLecturers = [];

		if (!this.currentClass.subject) {
			return;
		}

		this.groupService.getAvailableGroups(
			this.currentEditor.faculty.id,
			this.currentClass.subject.id,
			getDayOfWeekNumber(this.currentClass.dayOfWeek),
			this.currentClass.number)
			.subscribe((groups: models.Group[]) =>
				this.availableGroups = groups.concat(this.currentClass.groups)
					.sort((g1: models.Group, g2: models.Group) =>
						getCurrentGroupName(g1).localeCompare(getCurrentGroupName(g2))));

		this.userService.getAvailableLecturers(
			this.currentEditor.faculty.id,
			this.currentClass.subject.id,
			getDayOfWeekNumber(this.currentClass.dayOfWeek),
			this.currentClass.number)
			.subscribe((lecturers: models.User[]) =>
				this.availableLecturers = lecturers.filter(
					l => l.id !== this.contextLecturer.id));
	}

	resetGroupsAndLecturers(): void {
		this.currentClass.groups = [];
		this.currentClass.lecturers = [ this.contextLecturer ];
		this.availableGroups = [];
		this.availableLecturers = [];

		if (!this.currentClass.subject) {
			return;
		}

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

	setClassrooms(): void {
		this.availableClassrooms = [];

		if (!this.currentClass.classroomType) {
			return;
		}

		for (let building of this.availableBuildings) {
			this.classroomService.getAvailableClassrooms(
				building.id,
				this.currentClass.classroomType.id,
				getDayOfWeekNumber(this.currentClass.dayOfWeek),
				this.currentClass.number)
				.subscribe((classrooms: models.Classroom[]) =>
					this.availableClassrooms.push({
						building: building,
						classrooms: classrooms
					}));
		}
	}

	resetClassrooms(): void {
		this.currentClass.classrooms = [];
		this.availableClassrooms = [];

		if (!this.currentClass.classroomType) {
			return;
		}

		for (let building of this.availableBuildings) {
			this.classroomService.getAvailableClassrooms(
				building.id,
				this.currentClass.classroomType.id,
				getDayOfWeekNumber(this.currentClass.dayOfWeek),
				this.currentClass.number)
				.subscribe((classrooms: models.Classroom[]) =>
					this.availableClassrooms.push({
						building: building,
						classrooms: classrooms
					}));
		}
	}

	classroomChecked(classroom: models.Classroom): void {
		if (this.currentClass.classrooms.includes(classroom)) {
			this.currentClass.classrooms = this.currentClass.classrooms.filter(
				c => c.id !== classroom.id);
		} else {
			this.currentClass.classrooms.push(classroom);
		}
	}

	groupChecked(group: models.Group): void {
		if (this.currentClass.groups.includes(group)) {
			this.currentClass.groups = this.currentClass.groups.filter(
				g => g.id !== group.id);
		} else {
			this.currentClass.groups.push(group);
		}
	}

	isGroupChecked(group: models.Group): boolean {
		return this.currentClass.groups.find(g => g.id === group.id) as any;
	}

	lecturerChecked(lecturer: models.User): void {
		if (this.currentClass.lecturers.includes(lecturer)) {
			this.currentClass.lecturers = this.currentClass.lecturers.filter(
				l => l.id !== lecturer.id);
		} else {
			this.currentClass.lecturers.push(lecturer);
		}
	}

	getTotalNumberOfStudents(): number {
		return this.currentClass.groups.reduce(
			(prev: number, curr: models.Group) => prev + curr.numStudents, 0);
	}

	getTotalCapacity(): number {
		return this.currentClass.classrooms.reduce(
			(prev: number, curr: models.Classroom) => prev + curr.capacity, 0);
	}

	submit(): void {
		if (!this.isClassValid()) {
			this.errorText = "Заповніть усі поля.";
			this.error = false;
			return;
		}

		const action = this.isEditing
			? this.classService.updateClass(this.currentClass)
			: this.classService.addClass(this.currentClass);

		action.subscribe(
			() => this.activeModal.close(this.currentClass),
			() => this.errorText =
				"Під час створення пари сталася помилка. " +
				"Спробуйте ще раз.");
	}

	isClassValid(): boolean {
		return this.currentClass.classrooms.length !== 0 &&
				this.currentClass.groups.length !== 0 &&
				this.currentClass.frequency !== null;
	}

	deleteClass(): void {
		this.classService.deleteClass(this.currentClass)
			.subscribe(
				() => this.activeModal.close(this.currentClass.id),
				() => this.errorText =
					"Під час видалення пари сталася помилка. " +
					"Спробуйте ще раз.");
	}

	getCurrentGroupName = getCurrentGroupName;
	getClassroomsAsString = getClassroomsAsString;
	getGroupsAsString = getGroupsAsString;
	getLecturersAsString = getLecturersAsString;
	getLecturerInitials = getLecturerInitials;
}

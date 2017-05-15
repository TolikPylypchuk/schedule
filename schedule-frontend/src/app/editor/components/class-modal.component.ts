import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import * as models from "../../common/models/models";
import * as services from "../../common/services/services";

import {
	getCurrentYear, getCurrentSemester,
	getLecturerInitials, getGroupsAsString,
	getCurrentGroupName
} from "../../common/models/functions";

@Component({
	selector: "schedule-editor-class-modal",
	templateUrl: "./class-modal.component.html"
})
export class ClassModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private buildingService: services.BuildingService;
	private classService: services.ClassService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
	private groupService: services.GroupService;
	private planService: services.PlanService;
	private subjectService: services.SubjectService;
	private userService: services.UserService;

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

	selectedBuilding: models.Building;
	buildings: models.Building[] = [];
	subjects: models.Subject[] = [];
	classroomTypes: models.ClassroomType[] = [];
	availableClassrooms: models.Classroom[] = [];
	availableGroups: models.Group[] = [];
	availableLecturers: models.User[] = [];

	constructor(
		activeModal: NgbActiveModal,
		buildingService: services.BuildingService,
		classService: services.ClassService,
		classroomService: services.ClassroomService,
		classroomTypeService: services.ClassroomTypeService,
		groupService: services.GroupService,
		planService: services.PlanService,
		subjectService: services.SubjectService,
		userService: services.UserService) {
		this.activeModal = activeModal;
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
				this.subjectSelected();
			});

		this.buildingService.getBuildings()
			.subscribe((buildings: models.Building[]) => this.buildings = buildings);

		this.classroomTypeService.getClassroomTypes()
			.subscribe((types: models.ClassroomType[]) => this.classroomTypes = types);
	}

	subjectSelected(): void {
		this.currentClass.groups = [];

		this.planService.getPlansBySubjectAndYearAndSemester(
			this.subjects[0].id, this.currentClass.year, this.currentClass.semester)
			.map((plans: models.Plan[]) => plans.map(p => p.group))
			.subscribe((groups: models.Group[]) => {
				this.availableGroups = [];
				for (let group of groups) {
					this.classService.getClassesByGroupAndYearAndSemester(
						group.id,
						this.currentClass.year,
						this.currentClass.semester)
						.subscribe((classes: models.Class[]) => {
							if (classes.every(c =>
								c.dayOfWeek !== this.currentClass.dayOfWeek ||
								c.number !== this.currentClass.number)) {
								this.availableGroups.push(group);
								this.availableGroups.sort(
									(g1: models.Group, g2: models.Group) =>
										getCurrentGroupName(g1)
											.localeCompare(
												getCurrentGroupName(g2)));
							}
						});
				}
			});
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

	getCurrentGroupName = getCurrentGroupName;
	getGroupsAsString = getGroupsAsString;
	getLecturerInitials = getLecturerInitials;
}

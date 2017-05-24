import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
	Building, Faculty, Classroom, ClassroomType, Subject
} from "../../common/models/models";

import {
	BuildingService, FacultyService, ClassroomService,
	ClassroomTypeService, SubjectService
} from "../../common/services/services";

import { BuildingModalComponent } from "./building-modal.component";
import { ClassroomModalComponent } from "./classroom-modal.component";
import { ClassroomTypeModalComponent } from "./classroom-type-modal.component";
import { FacultyModalComponent } from "./faculty-modal.component";
import { SubjectModalComponent } from "./subject-modal.component";

@Component({
	selector: "schedule-admin-home",
	templateUrl: "./additional.component.html"
})
export class AdditionalComponent implements OnInit {
	private modalService: NgbModal;

	private buildingService: BuildingService;
	private classroomService: ClassroomService;
	private classroomTypeService: ClassroomTypeService;
	private facultyService: FacultyService;
	private subjectService: SubjectService;

	faculties: Faculty[] = [];
	buildings: Building[] = [];
	classrooms: Map<number, Classroom[]> = new Map();
	classroomTypes: ClassroomType[] = [];
	subjects: Subject[];

	constructor(
		modalService: NgbModal,
		buildingService: BuildingService,
		classroomService: ClassroomService,
		classroomTypeService: ClassroomTypeService,
		facultyService: FacultyService,
		subjectService: SubjectService) {
		this.modalService = modalService;

		this.buildingService = buildingService;
		this.classroomService = classroomService;
		this.classroomTypeService = classroomTypeService;
		this.facultyService = facultyService;
		this.subjectService = subjectService;
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) =>
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name)));

		this.classroomTypeService.getClassroomTypes()
			.subscribe((types: ClassroomType[]) =>
				this.classroomTypes = types.sort(
					(t1, t2) => t1.type.localeCompare(t2.type)));

		this.buildingService.getBuildings()
			.subscribe((buildings: Building[]) => {
					this.buildings = buildings.sort(
						(b1, b2) => b1.name.localeCompare(b2.name));

					for (const building of buildings) {
						this.classroomService.getClassroomsByBuilding(building.id)
							.subscribe((classrooms: Classroom[]) =>
								this.classrooms.set(
									building.id,
									classrooms.sort(
										(c1, c2) => c1.number.localeCompare(c2.number))))
					}
				});

		this.subjectService.getSubjects()
			.subscribe((subjects: Subject[]) =>
				this.subjects = subjects.sort(
					(s1, s2) => s1.name.localeCompare(s2.name)));
	}

	addFacultyClicked(): void {
		const modalRef = this.modalService.open(FacultyModalComponent);

		modalRef.result.then(
			(faculty: Faculty) => {
				this.faculties.push(faculty);
				this.faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name));
			},
			() => { });
	}

	editFacultyClicked(faculty: Faculty): void {
		const modalRef = this.modalService.open(FacultyModalComponent);
		const modal = modalRef.componentInstance as FacultyModalComponent;

		modal.isEditing = true;
		modal.faculty = {
			id: faculty.id,
			name: faculty.name
		};

		modalRef.result.then(
			(updatedFaculty: Faculty) => faculty.name = updatedFaculty.name,
			() => { });
	}

	deleteFacultyClicked(id: number): void {
		const action = this.facultyService.deleteFaculty(id);
		action.subscribe(
			() => this.faculties = this.faculties.filter(f => f.id !== id),
			() => { });

		action.connect();
	}

	addBuildingClicked(): void {
		const modalRef = this.modalService.open(BuildingModalComponent);

		modalRef.result.then(
			(building: Building) => {
				this.classrooms.set(building.id, []);
				this.buildings.push(building);
				this.buildings.sort(
					(b1, b2) => b1.name.localeCompare(b2.name));
			},
			() => { });
	}

	editBuildingClicked(building: Building): void {
		const modalRef = this.modalService.open(BuildingModalComponent);
		const modal = modalRef.componentInstance as BuildingModalComponent;

		modal.isEditing = true;
		modal.building = {
			id: building.id,
			name: building.name,
			street: building.street,
			number: building.number
		};

		modalRef.result.then(
			(updatedBuilding: Building) => {
				building.name = updatedBuilding.name;
				building.street = updatedBuilding.street;
				building.number = updatedBuilding.number;
			},
			() => { });
	}

	deleteBuildingClicked(id: number): void {
		const action = this.buildingService.deleteBuilding(id);
		action.subscribe(
			() => {
				this.buildings = this.buildings.filter(b => b.id !== id);
				this.classrooms.delete(id);
			},
			() => { });

		action.connect();
	}

	addClassroomClicked(building: Building): void {
		const modalRef = this.modalService.open(ClassroomModalComponent);
		const modal = modalRef.componentInstance as ClassroomModalComponent;

		modal.classroom.building = building;
		modal.classroomTypes = this.classroomTypes.filter(
			t => t.type !== "Будь-яка");

		modalRef.result.then(
			(classroom: Classroom) => {
				this.classrooms.get(building.id).push(classroom);
				this.classrooms.get(building.id).sort(
					(c1, c2) => c1.number.localeCompare(c2.number));
			},
			() => { });
	}

	editClassroomClicked(classroom: Classroom): void {
		const modalRef = this.modalService.open(ClassroomModalComponent);
		const modal = modalRef.componentInstance as ClassroomModalComponent;

		modal.isEditing = true;
		modal.classroomTypes = this.classroomTypes.filter(
			t => t.type !== "Будь-яка");

		modal.classroom = {
			building: classroom.building,
			id: classroom.id,
			number: classroom.number,
			type: classroom.type,
			capacity: classroom.capacity
		};

		modalRef.result.then(
			(updatedClassroom: Classroom) => {
				classroom.number = updatedClassroom.number;
				classroom.type = updatedClassroom.type;
				classroom.capacity = updatedClassroom.capacity;
			},
			() => { });
	}

	deleteClassroomClicked(classroom: Classroom): void {
		const action = this.classroomService.deleteClassroom(classroom.id);
		action.subscribe(
			() => this.classrooms.set(
				classroom.building.id,
				this.classrooms.get(classroom.building.id).filter(
					c => c.id !== classroom.id)),
			() => { });

		action.connect();
	}

	addClassroomTypeClicked(): void {
		const modalRef = this.modalService.open(ClassroomTypeModalComponent);

		modalRef.result.then(
			(type: ClassroomType) => {
				this.classroomTypes.push(type);
				this.classroomTypes.sort(
					(t1, t2) => t1.type.localeCompare(t2.type));
			},
			() => { });
	}

	editClassroomTypeClicked(classroomType: ClassroomType): void {
		const modalRef = this.modalService.open(ClassroomTypeModalComponent);
		const modal = modalRef.componentInstance as ClassroomTypeModalComponent;

		modal.isEditing = true;
		modal.classroomType = {
			id: classroomType.id,
			type: classroomType.type
		};

		modalRef.result.then(
			(updatedType: ClassroomType) => classroomType.type = updatedType.type,
			() => { });
	}

	deleteClassroomTypeClicked(id: number): void {
		const action = this.classroomTypeService.deleteClassroomType(id);
		action.subscribe(
			() => this.classroomTypes = this.classroomTypes.filter(t => t.id !== id),
			() => { });

		action.connect();
	}

	addSubjectClicked(): void {
		const modalRef = this.modalService.open(SubjectModalComponent);

		modalRef.result.then(
			(subject: Subject) => {
				this.subjects.push(subject);
				this.subjects.sort(
					(s1, s2) => s1.name.localeCompare(s2.name));
			},
			() => { });
	}

	editSubjectClicked(subject: Subject): void {
		const modalRef = this.modalService.open(SubjectModalComponent);
		const modal = modalRef.componentInstance as SubjectModalComponent;

		modal.isEditing = true;
		modal.subject = {
			id: subject.id,
			name: subject.name,
			lecturers: subject.lecturers
		};

		modalRef.result.then(
			(updatedSubject: Subject) => {
				subject.name = updatedSubject.name;
				subject.lecturers = updatedSubject.lecturers;
			},
			() => { });
	}

	deleteSubjectClicked(id: number): void {
		const action = this.subjectService.deleteSubject(id);
		action.subscribe(
			() => this.subjects = this.subjects.filter(s => s.id !== id),
			() => { });

		action.connect();
	}
}

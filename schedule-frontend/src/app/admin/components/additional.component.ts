import { Component, OnInit } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
	Building, Faculty, Classroom, ClassroomType
} from '../../common/models/models';

import {
	BuildingService, FacultyService, ClassroomService, ClassroomTypeService
} from "../../common/services/services";

import { BuildingModalComponent } from './building-modal.component';
import { FacultyModalComponent } from "./faculty-modal.component";

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

	faculties: Faculty[] = [];
	buildings: Building[] = [];
	classrooms: Map<number, Classroom[]> = new Map();
	classroomTypes: ClassroomType[] = [];

	constructor(
		modalService: NgbModal,
		buildingService: BuildingService,
		classroomService: ClassroomService,
		classroomTypeService: ClassroomTypeService,
		facultyService: FacultyService) {
		this.modalService = modalService;

		this.buildingService = buildingService;
		this.classroomService = classroomService;
		this.classroomTypeService = classroomTypeService;
		this.facultyService = facultyService;
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) =>
				this.faculties = faculties.sort(
					(f1, f2) => f1.name.localeCompare(f2.name)));

		this.classroomTypeService.getClassroomTypes()
			.subscribe((types: ClassroomType[]) =>
				this.classroomTypes = types);

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
}

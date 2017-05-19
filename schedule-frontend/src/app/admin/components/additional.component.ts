import { Component, OnInit } from "@angular/core";

import {
	Building, Faculty, Classroom, ClassroomType
} from '../../common/models/models';

import {
	BuildingService, FacultyService, ClassroomService, ClassroomTypeService
} from "../../common/services/services";

@Component({
	selector: "schedule-admin-home",
	templateUrl: "./additional.component.html"
})
export class AdditionalComponent implements OnInit {
	private buildingService: BuildingService;
	private classroomService: ClassroomService;
	private classroomTypeService: ClassroomTypeService;
	private facultyService: FacultyService;

	faculties: Faculty[] = [];
	buildings: Building[] = [];
	classrooms: Map<number, Classroom[]> = new Map();
	classroomTypes: ClassroomType[] = [];

	constructor(
		buildingService: BuildingService,
		classroomService: ClassroomService,
		classroomTypeService: ClassroomTypeService,
		facultyService: FacultyService) {
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
}

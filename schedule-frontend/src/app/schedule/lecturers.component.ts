import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
	UserService, FacultyService
} from "../services/services";

import { Faculty, Lecturer } from "../models/models";
import { compareLecturersByName } from "../models/functions";

@Component({
	selector: "schedule-lecturers",
	templateUrl: "./lecturers.component.html"
})
export class LecturersComponent implements OnInit {
	private router: Router;
	private facultyService: FacultyService;
	private lecturerService: UserService;

	faculties: Faculty[];
	lecturers: Map<number, Lecturer[]>;

	constructor(
		router: Router,
		facultyService: FacultyService,
		lecturerService: UserService) {
		this.router = router;
		this.facultyService = facultyService;
		this.lecturerService = lecturerService;
		this.lecturers = new Map();
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe((faculties: Faculty[]) => {
				faculties.sort((f1, f2) => f1.name.localeCompare(f2.name));
				this.faculties = faculties;

				for (let faculty of faculties) {
					this.lecturerService.getLecturersByFaculty(faculty.id)
						.subscribe((lecturers: Lecturer[]) => {
							lecturers.sort(compareLecturersByName);
							this.lecturers.set(faculty.id, lecturers);
						});
				}
			});
	}

	navigateToLecturer(lecturerId: number): void {
		this.router.navigate([ "/schedule/lecturer", lecturerId ]);
	}
}


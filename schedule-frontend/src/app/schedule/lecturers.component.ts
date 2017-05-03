import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
	LecturerService, FacultyService
} from "../services/services";

import { Faculty, Lecturer } from "../models/models";

@Component({
	selector: "schedule-lecturers",
	templateUrl: "./lecturers.component.html"
})
export class LecturersComponent implements OnInit {
	private router: Router;
	private facultyService: FacultyService;
	private lecturerService: LecturerService;

	faculties: Faculty[];
	lecturers: Map<number, Lecturer[]>;

	constructor(
		router: Router,
		facultyService: FacultyService,
		lecturerService: LecturerService) {
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
							lecturers.sort((l1, l2) => {
								let result = l1.lastName.localeCompare(l2.lastName);

								if (result === 0)
								{
									result = l1.firstName.localeCompare(l2.firstName);

									if (result === 0)
									{
										result = l1.middleName.localeCompare(l2.middleName);
									}
								}

								return result;
							});
							this.lecturers.set(faculty.id, lecturers);
						});
				}
			});
	}

	navigateToLecturer(lecturerId: number): void {
		this.router.navigate([ "/schedule/lecturer", lecturerId ]);
	}
}


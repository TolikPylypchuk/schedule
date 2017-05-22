import { Component, OnInit } from "@angular/core";

import {
	getUserInitials, compareUsersByName
} from "../../common/models/functions";

import { Faculty, User } from "../../common/models/models";
import { FacultyService, UserService } from "../../common/services/services";

@Component({
	selector: "schedule-admin-home",
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	private facultyService: FacultyService;
	private userService: UserService;

	faculties: Faculty[] = [];
	lecturers: Map<number, User[]> = new Map();
	editors: Map<number, User[]> = new Map();
	admins: User[] = [];

	constructor(facultyService: FacultyService, userService: UserService) {
		this.facultyService = facultyService;
		this.userService = userService;
	}

		ngOnInit(): void {
	this.facultyService.getFaculties()
		.subscribe((faculties: Faculty[]) => {
			this.faculties = faculties.sort(
				(f1, f2) => f1.name.localeCompare(f2.name));

			this.userService.getAdmins()
				.subscribe((admins: User[]) => this.admins = admins);

			for (const faculty of faculties) {
				this.userService.getLecturersByFaculty(faculty.id)
					.subscribe((lecturers: User[]) =>
						this.lecturers.set(
							faculty.id, lecturers.sort(compareUsersByName)));

				this.userService.getEditorsByFaculty(faculty.id)
					.subscribe((editors: User[]) =>
						this.editors.set(
							faculty.id, editors.sort(compareUsersByName)));
			}
			});
	}

	getUserInitials = getUserInitials;
}

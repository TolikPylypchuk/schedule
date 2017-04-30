import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
	GroupService, FacultyService, getCurrentCourse
} from "../services/services";

import { Faculty, Group } from "../models/models";

@Component({
	selector: "schedule-start",
	templateUrl: "./start.component.html"
})
export class StartComponent implements OnInit {
	private router: Router;
	private facultyService: FacultyService;
	private groupService: GroupService;

	faculties: Faculty[];
	groups: Map<number, Group[]>;

	constructor(
		router: Router,
		facultyService: FacultyService,
		groupService: GroupService) {
		this.router = router;
		this.facultyService = facultyService;
		this.groupService = groupService;
		this.groups = new Map();
	}

	ngOnInit(): void {
		this.facultyService.getFaculties()
			.subscribe(faculties => {
				this.faculties = faculties;

				for (let faculty of faculties) {
					this.groupService.getGroupsByFaculty(faculty.id)
						.subscribe(groups => {
							this.groups.set(faculty.id, groups);
						});
				}
			});
	}

	getGroups(facultyId: number, course: number): Group[] {
		return this.groups.has(facultyId)
			? this.groups.get(facultyId)
				.filter(g => getCurrentCourse(g) === course)
			: [];
	}

	navigateToGroup(groupId: number): void {
		this.router.navigate([ "/schedule-group", groupId ]);
	}
}

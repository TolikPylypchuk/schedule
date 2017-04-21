import { Component, OnInit } from "@angular/core";

import { FacultyService } from "../services/services";
import { GroupService } from "../services/services";

import { Faculty, Group } from "../models/models";

@Component({
	selector: "schedule-start",
	templateUrl: "./start.component.html",
	styleUrls: [ "./start.component.css" ]
})
export class StartComponent implements OnInit {
	private facultyService: FacultyService;
	private groupService: GroupService;

	faculties: Faculty[];
	groups: Map<number, Group[]>;

	constructor(facultyService: FacultyService, groupService: GroupService) {
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
						.subscribe(groups => this.groups.set(faculty.id, groups));
				}
			});
	}

	getGroups(facultyId: number, year: number): Group[] {
		return this.groups.has(facultyId)
			? this.groups.get(facultyId)
				.filter(g => g[g.name.indexOf('-') + 1] === year.toString())
			: [];
	}
}

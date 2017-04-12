import { Component, OnInit } from "@angular/core";

import { ApiService } from "../services/services";

import { Faculty, Group } from "../models/models";

@Component({
	selector: "schedule-start",
	templateUrl: "./start.component.html",
	styleUrls: [ "./start.component.css" ]
})
export class StartComponent implements OnInit {
	private apiService: ApiService;

	faculties: Faculty[];
	groups: Map<number, Group[]>;

	constructor(apiService: ApiService) {
		this.apiService = apiService;
		this.groups = new Map();
	}

	ngOnInit(): void {
		this.apiService.getFaculties()
			.subscribe(faculties => {
				this.faculties = faculties;

				for (let faculty of faculties) {
					this.apiService.getGroupsByFaculty(faculty.id)
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

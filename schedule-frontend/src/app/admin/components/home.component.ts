import { Component } from "@angular/core";

import { FacultyService, UserService } from "../../common/services/services";

@Component({
	selector: "schedule-admin-home",
	templateUrl: "./home.component.html"
})
export class HomeComponent {
	private facultyService: FacultyService;
	private userService: UserService;
}

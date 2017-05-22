import { Component } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { getUserInitials } from "../../common/models/functions";

import { AuthService } from "../../auth/services/auth.service";

@Component({
	selector: "schedule-lecturer-root",
	templateUrl: "./lecturer.component.html"
})
export class LecturerComponent {
	private authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	currentUserInitials(): Observable<string> {
		return this.authService.getCurrentUser()
			.map(user => getUserInitials(user));
	}
}

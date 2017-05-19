import { Component } from "@angular/core";

import { AuthService } from "../../auth/services/auth.service";

@Component({
	selector: "schedule-schedule-root",
	templateUrl: "./schedule.component.html"
})
export class ScheduleComponent {
	private authService: AuthService;

	constructor(authService: AuthService) {
		this.authService = authService;
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	logout(): void {
		this.authService.logout();
	}
}

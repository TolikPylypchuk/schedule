import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../auth/auth";
import { User } from '../common/models/models';

@Component({
	selector: "schedule-editor-home",
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	private router: Router;
	private authService: AuthService;

	currentUser: User;

	constructor(router: Router, authService: AuthService) {
		this.router = router;
		this.authService = authService;
	}

	ngOnInit(): void {
		this.authService.getCurrentUser()
			.subscribe((user: User) => this.currentUser = user);
	}

	navigateToSchedule(): void {
		this.router.navigate([ "/editor/schedule" ]);
	}
}

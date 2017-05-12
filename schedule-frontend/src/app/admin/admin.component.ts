import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../auth/auth";
import { User } from '../models/models';

@Component({
	selector: "schedule-admin",
	templateUrl: "./admin.component.html"
})
export class AdminComponent implements OnInit {
	private router: Router;
	private authService: AuthService;

	currentUser: User;

	constructor(router: Router, authService: AuthService) {
		this.router = router;
		this.authService = authService;
	}

	ngOnInit(): void {
		this.authService.getCurrentUserAsObservable()
			.subscribe((user: User) => this.currentUser = user);
	}

	navigateToSchedule(): void {
		this.router.navigate([ "/admin/schedule" ]);
	}
}

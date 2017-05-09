import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { Lecturer } from '../models/models';

@Component({
	selector: "schedule-admin",
	templateUrl: "./admin.component.html"
})
export class AdminComponent implements OnInit {
	private router: Router;
	private authService: AuthService;

	currentUser: Lecturer;

	constructor(router: Router, authService: AuthService) {
		this.router = router;
		this.authService = authService;
	}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
	}

	navigateToSchedule(): void {
		this.router.navigate([ "/admin/schedule" ]);
	}
}

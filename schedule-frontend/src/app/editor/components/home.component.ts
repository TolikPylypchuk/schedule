import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../auth/auth";

import {Group, Plan, Subject, User} from '../../common/models/models';
import {
	GroupService, SubjectService, PlanService
} from "../../common/services/services";

import {
	getCurrentGroupCourse, getCurrentGroupName
} from "../../common/models/functions";

@Component({
	selector: "schedule-editor-home",
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	private router: Router;
	private authService: AuthService;
	private groupService: GroupService;
	private subjectSirvice: SubjectService;
	private planSirvice: PlanService;

	currentUser: User;
	groups: Group[];
	subjects: Subject[];
	plans: Map<number, Plan[]> = new Map();

	constructor(
		router: Router,
		authService: AuthService,
		groupService: GroupService,
		subjectService: SubjectService,
		planService: PlanService) {
		this.router = router;
		this.authService = authService;
		this.groupService = groupService;
		this.subjectSirvice = subjectService;
		this.planSirvice = planService;
	}

	ngOnInit(): void {
		this.authService.getCurrentUser()
			.subscribe((user: User) => this.currentUser = user);

		this.groupService.getGroupsByFaculty(this.currentUser.faculty.id)
			.subscribe((groups: Group[]) => {
			this.groups = groups.sort(
				(g1, g2) => getCurrentGroupName(g1).localeCompare(getCurrentGroupName(g2)));

			for (const group of groups) {
				this.planSirvice.getPlansByGroup(group.id)
					.subscribe((plans: Plan[]) => {
						this.plans.set(group.id, plans);
					});
			}

			});

		this.subjectSirvice.getSubjects()
			.subscribe((subjects: Subject[]) => {
				this.subjects = subjects;
			});
	}

	navigateToSchedule(): void {
		this.router.navigate([ "/editor/schedule" ]);
	}

	getCurrentGroupName = getCurrentGroupName;
}

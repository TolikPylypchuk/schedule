import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../../auth/auth";

import { Group, Plan, User } from "../../common/models/models";
import {
	GroupService, SubjectService, PlanService
} from "../../common/services/services";

import {
	getCurrentGroupName, getCurrentYear, getCurrentSemester
} from "../../common/models/functions";

import { GroupModalComponent } from "./group-modal.component";
import { PlanModalComponent } from "./plan-modal.component";

@Component({
	selector: "schedule-editor-home",
	templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
	private modalService: NgbModal;

	private router: Router;
	private authService: AuthService;
	private groupService: GroupService;
	private subjectService: SubjectService;
	private planSirvice: PlanService;

	currentUser: User;
	groups: Group[];
	plans: Map<number, Plan[]> = new Map();

	constructor(
		modalService: NgbModal,
		router: Router,
		authService: AuthService,
		groupService: GroupService,
		subjectService: SubjectService,
		planService: PlanService) {
		this.modalService = modalService;
		this.router = router;
		this.authService = authService;
		this.groupService = groupService;
		this.subjectService = subjectService;
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
						this.plans.set(
							group.id,
							plans.sort((p1, p2) => p1.subject.name.localeCompare(p2.subject.name)));
					});
			}

			});
	}

	addGroup(): void {
		const modalRef = this.modalService.open(GroupModalComponent);
		const modal = modalRef.componentInstance as GroupModalComponent;

		modal.group.faculty = this.currentUser.faculty;
		modal.group.year = getCurrentYear();

		modalRef.result.then(
			(newGroup: Group) => {
				this.groups.push(newGroup);
				this.groups.sort((g1, g2) => g1.name.localeCompare(g2.name));
			},
			() => { });
	}

	editGroup(group: Group): void {
		const modalRef = this.modalService.open(GroupModalComponent);
		const modal = modalRef.componentInstance as GroupModalComponent;

		modal.group = {
			id: group.id,
			name: group.name,
			faculty: group.faculty,
			numStudents: group.numStudents,
			year: group.year
		};

		modal.isEditing = true;

		modalRef.result.then(
			(newGroup: Group) => {
				group.name = newGroup.name;
				group.numStudents = newGroup.numStudents;

				this.groups.sort((g1, g2) => g1.name.localeCompare(g2.name));
			},
			() => { });
	}

	deleteGroup(id: number): void {
		const action = this.groupService.deleteGroup(id);

		action.subscribe(
			() => this.groups = this.groups.filter(g => g.id !== id),
			() => { });

		action.connect();
	}

	addPlan(group: Group): void {
		const modalRef = this.modalService.open(PlanModalComponent);
		const modal = modalRef.componentInstance as PlanModalComponent;

		modal.plan.group = group;
		modal.plan.year = getCurrentYear();
		modal.plan.semester = getCurrentSemester();

		modalRef.result.then(
			(newPlan: Plan) => {
				this.plans.get(group.id).push(newPlan);
				this.plans.get(group.id).sort(
					(p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
			},
			() => { });
	}

	editPlan(plan: Plan): void {
		const modalRef = this.modalService.open(PlanModalComponent);
		const modal = modalRef.componentInstance as PlanModalComponent;

		modal.plan = {
			id: plan.id,
			group: plan.group,
			subject: plan.subject,
			numLectures: plan.numLectures,
			numPractice: plan.numPractice,
			numLabs: plan.numLabs,
			year: plan.year,
			semester: plan.semester
		};

		modal.isEditing = true;

		modalRef.result.then(
			(newPlan: Plan) => {
				plan.subject = newPlan.subject;
				plan.numLectures = newPlan.numLectures;
				plan.numPractice = newPlan.numPractice;
				plan.numLabs = newPlan.numLabs;

				this.plans.get(plan.group.id).sort(
					(p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
			},
			() => { });
	}

	deletePlan(plan: Plan): void {
		const action = this.planSirvice.deletePlan(plan.id);

		action.subscribe(
			() =>
				this.plans.set(
					plan.group.id,
					this.plans.get(plan.group.id).filter(p => p.id !== plan.id)),
			() => { });

		action.connect();
	}

	getCurrentGroupName = getCurrentGroupName;
}

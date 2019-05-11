import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthService } from "../../../auth/auth";

import { Group, Plan, User, Department } from "../../../common/models/models";
import {
    DepartmentService, SubjectService, PlanService
} from "../../../common/services/services";

import {
    getCurrentGroupName, getCurrentYear, getCurrentSemester
} from "../../../common/models/functions";

import { PlanModalComponent } from "./plan-modal.component";

@Component({
    selector: "schedule-editor-plans",
    templateUrl: "./plans.component.html"
})
export class PlansComponent implements OnInit {
    private modalService: NgbModal;

    private router: Router;
    private authService: AuthService;
    private departmentService: DepartmentService;
    private subjectService: SubjectService;
    private planService: PlanService;

    currentUser: User;
    departments: Department[];
    plans: Map<number, Plan[]> = new Map();

    getCurrentGroupName = getCurrentGroupName;

    constructor(
        modalService: NgbModal,
        router: Router,
        authService: AuthService,
        departmentService: DepartmentService,
        subjectService: SubjectService,
        planService: PlanService) {
        this.modalService = modalService;
        this.router = router;
        this.authService = authService;
        this.departmentService = departmentService;
        this.subjectService = subjectService;
        this.planService = planService;
    }

    ngOnInit(): void {
        this.authService.getCurrentUser()
            .subscribe((user: User) => this.currentUser = user);

        this.departmentService.getDepartmentsByFaculty(this.currentUser.department.faculty.id)
            .subscribe((departments: Department[]) => {
                this.departments = departments.sort(
                    (d1, d2) => d1.name.localeCompare(d2.name));

                for (const department of departments) {
                    this.planService.getPlansByGroupAndYearAndSemester(
                        department.id,
                        getCurrentYear(),
                        getCurrentSemester())
                        .subscribe((plans: Plan[]) => {
                            this.plans.set(
                                department.id,
                                plans.sort((p1, p2) => p1.subject.name.localeCompare(p2.subject.name)));
                        });
                }
            });
    }

    getPlans(departmentId: number, course: number): Plan[] {
        return this.plans.get(departmentId).filter(p => p.course === course);
    }

    addPlan(department: Department, course: number): void {
        const modalRef = this.modalService.open(PlanModalComponent);
        const modal = modalRef.componentInstance as PlanModalComponent;

        modal.plan.department = department;
        modal.plan.course = course;
        modal.plan.year = getCurrentYear();
        modal.plan.semester = getCurrentSemester();

        modalRef.result.then(
            (newPlan: Plan) => {
                this.plans.get(department.id).push(newPlan);
                this.plans.get(department.id).sort(
                    (p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
            },
            () => { });
    }

    editPlan(plan: Plan): void {
        const modalRef = this.modalService.open(PlanModalComponent);
        const modal = modalRef.componentInstance as PlanModalComponent;

        modal.plan = {
            id: plan.id,
            department: plan.department,
            course: plan.course,
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

                this.plans.get(plan.department.id).sort(
                    (p1, p2) => p1.subject.name.localeCompare(p2.subject.name));
            },
            () => { });
    }

    deletePlan(plan: Plan): void {
        const action = this.planService.deletePlan(plan.id);

        action.subscribe(
            () =>
                this.plans.set(
                    plan.department.id,
                    this.plans.get(plan.department.id).filter(p => p.id !== plan.id)),
            () => { });

        action.connect();
    }
}

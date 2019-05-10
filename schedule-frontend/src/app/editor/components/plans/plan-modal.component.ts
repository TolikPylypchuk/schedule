import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Plan, Subject } from "../../../common/models/models";
import { PlanService, SubjectService } from "../../../common/services/services";

@Component({
	selector: "schedule-editor-plan-modal",
	templateUrl: "./plan-modal.component.html"
})
export class PlanModalComponent implements OnInit {
	private activeModal: NgbActiveModal;

	private planService: PlanService;
	private subjectService: SubjectService;

	plan: Plan = {
		department: null,
		course: 0,
		subject: null,
		year: 0,
		semester: 0,
		numLectures: 0,
		numPractice: 0,
		numLabs: 0
	};

	subjects: Subject[] = [];
	isEditing = false;

	error = false;
	errorText = "";

	constructor(
		activeModal: NgbActiveModal,
		planService: PlanService,
		subjectService: SubjectService) {
		this.activeModal = activeModal;
		this.planService = planService;
		this.subjectService = subjectService;
	}

	ngOnInit(): void {
		this.subjectService.getSubjects()
			.subscribe((subjects: Subject[]) => {
				this.planService.getPlansByGroupAndYearAndSemester(
					// TODO: refactor to departmment
					this.plan.department.id, this.plan.year, this.plan.semester)
					.subscribe((plans: Plan[]) => {
						this.subjects = subjects.filter(
							s => !plans.find(
								p => (!this.isEditing || p.id !== this.plan.id) &&
									p.subject.id === s.id));

						this.plan.subject = this.subjects.find(
							s => s.id === this.plan.subject.id);
					});
			});
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.plan.subject) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		if (this.plan.numLectures < 0 || this.plan.numPractice < 0 ||
			this.plan.numLabs < 0) {
			this.error = true;
			this.errorText = "Кількість пар має бути невід'ємною.";
			return;
		}

		const action = this.isEditing
			? this.planService.updatePlan(this.plan)
			: this.planService.addPlan(this.plan);

		action.subscribe(
			() => this.activeModal.close(this.plan),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}

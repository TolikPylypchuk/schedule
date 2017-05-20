import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Faculty } from "../../common/models/models";
import { FacultyService } from "../../common/services/services";

@Component({
	selector: "schdedule-admin-faculty-modal",
	templateUrl: "./faculty-modal.component.html"
})
export class FacultyModalComponent {
	private activeModal: NgbActiveModal;

	private facultyService: FacultyService;

	faculty: Faculty = {
		name: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(activeModal: NgbActiveModal, facultyService: FacultyService) {
		this.activeModal = activeModal;
		this.facultyService = facultyService;
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.faculty.name || this.faculty.name.length === 0) {
			this.error = true;
			this.errorText = "Введіть назву факультету.";
			return;
		}

		const action = this.isEditing
			? this.facultyService.updateFaculty(this.faculty)
			: this.facultyService.addFaculty(this.faculty);

		action.subscribe(
			(response: Response) =>
				this.activeModal.close(this.faculty),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}

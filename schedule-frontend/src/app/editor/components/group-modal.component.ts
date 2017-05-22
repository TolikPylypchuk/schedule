import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Group } from "../../common/models/models";
import { GroupService } from "../../common/services/group.service";

@Component({
	selector: "schedule-editor-group-modal",
	templateUrl: "./group-modal.component.html"
})
export class GroupModalComponent {
	private activeModal: NgbActiveModal;

	private groupService:  GroupService;

	group:  Group = {
		name: null,
		numStudents: 0,
		year: 0,
		faculty: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(activeModal: NgbActiveModal, buildingService:  GroupService) {
		this.activeModal = activeModal;
		this.groupService = buildingService;
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.group.name || this.group.name.length === 0) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		if (this.group.numStudents < 0) {
			this.error = true;
			this.errorText = "Кількість студентів має бути невід'ємною.";
			return;
		}

		const action = this.isEditing
			? this.groupService.updateGroup(this.group)
			: this.groupService.addGroup(this.group);

		action.subscribe(
			() => this.activeModal.close(this.group),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}

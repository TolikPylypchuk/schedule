import { Component } from "@angular/core";
import { Response } from "@angular/http";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Building } from "../../common/models/models";
import { BuildingService } from "../../common/services/services";

@Component({
	selector: "schedule-admin-building-modal",
	templateUrl: "./building-modal.component.html"
})
export class BuildingModalComponent {
	private activeModal: NgbActiveModal;

	private buildingService: BuildingService;

	building: Building = {
		name: null,
		street: null,
		number: null
	};

	isEditing = false;
	error = false;
	errorText = "";

	constructor(activeModal: NgbActiveModal, facultyService: BuildingService) {
		this.activeModal = activeModal;
		this.buildingService = facultyService;
	}

	change(): void {
		this.error = false;
		this.errorText = "";
	}

	submit(): void {
		if (!this.building.name || this.building.name.length === 0 ||
			!this.building.street || this.building.street.length === 0 ||
			!this.building.number || this.building.number.length === 0) {
			this.error = true;
			this.errorText = "Заповніть усі поля.";
			return;
		}

		const action = this.isEditing
			? this.buildingService.updateBuilding(this.building)
			: this.buildingService.addBuilding(this.building);

		action.subscribe(
			(response: Response) =>
				this.activeModal.close(this.building),
			() => {
				this.error = true;
				this.errorText = "Не вдалося зберегти.";
			});

		action.connect();
	}
}

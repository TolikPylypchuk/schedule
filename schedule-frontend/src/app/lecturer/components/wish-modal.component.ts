import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { Wish } from "../../common/models/models";
import { WishService } from "../../common/services/wish.service";

@Component({
	selector: "schedule-lecturer-wish",
	templateUrl: "./wish-modal.component.html"
})
export class WishModalComponent {
	private activeModal: NgbActiveModal;

	private wishService: WishService;

	currentWish: Wish = {
		dayOfWeek: null,
		startTime: null,
		endTime: null,
		suitable: true,
		comment: null,
		year: null,
		semester: null,
		lecturer: null
	};

	isEditing = false;

	constructor(activeModal: NgbActiveModal, wishService: WishService) {
		this.activeModal = activeModal;
		this.wishService = wishService;
	}

	submit(): void {
		const action = this.isEditing
			? this.wishService.updateWish(this.currentWish)
			: this.wishService.addWish(this.currentWish);

		action.subscribe(() => this.activeModal.close(this.currentWish), () => { });

		action.connect();
	}
}

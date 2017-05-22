import { Component } from "@angular/core";

import { User } from "../../common/models/models";

@Component({
	selector: "schedule-lecturer-wish",
	templateUrl: "./wish-modal.component.html"
})
export class WishComponent {
	private currentLecturer: User;
}

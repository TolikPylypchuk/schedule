import { Component } from "@angular/core";

import * as services from "../../common/services/services";

@Component({
	selector: "schedule-admin-home",
	templateUrl: "./additional.component.html"
})
export class AdditionalComponent {
	private buildingService: services.BuildingService;
	private facultyService: services.FacultyService;
	private classroomService: services.ClassroomService;
	private classroomTypeService: services.ClassroomTypeService;
}

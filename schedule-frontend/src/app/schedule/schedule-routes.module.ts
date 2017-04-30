import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ScheduleGroupComponent } from "./schedule-group.component";
import { ScheduleLecturerComponent } from "./schedule-lecturer.component";

const routes: Routes = [
	{ path: "schedule-group/:id", component: ScheduleGroupComponent },
	{ path: "schedule-lecturer/:id", component: ScheduleLecturerComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class ScheduleRoutesModule { }

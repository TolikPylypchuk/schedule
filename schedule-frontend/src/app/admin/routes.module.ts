import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
	{ path: "admin/schedule", component: ScheduleComponent },
	{ path: "admin", component: AdminComponent }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutesModule { }


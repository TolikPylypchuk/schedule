import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { ScheduleRoutesModule } from "./schedule-routes.module";

import { StartComponent } from "./start.component";
import { ScheduleGroupComponent } from "./schedule-group.component";
import { ScheduleLecturerComponent } from "./schedule-lecturer.component";

@NgModule({
	declarations: [
		StartComponent,
		ScheduleGroupComponent,
		ScheduleLecturerComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		ScheduleRoutesModule
	]
})
export class ScheduleModule { }

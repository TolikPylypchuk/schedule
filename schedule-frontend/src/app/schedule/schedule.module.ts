import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { ScheduleRoutesModule } from "./schedule-routes.module";

import { StartComponent } from "./start.component";

@NgModule({
	declarations: [
		StartComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		ScheduleRoutesModule
	]
})
export class ScheduleModule { }

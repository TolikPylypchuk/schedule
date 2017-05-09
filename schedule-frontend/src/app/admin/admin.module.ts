import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";

import { AdminComponent } from "./admin.component";
import { ScheduleComponent } from "./schedule.component";

@NgModule({
	declarations: [
		AdminComponent,
		ScheduleComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		RoutesModule
	]
})
export class AdminModule { }

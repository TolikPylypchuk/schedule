import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";

import { ScheduleComponent } from "./schedule.component";
import { GroupsComponent } from "./groups.component";
import { LecturersComponent } from "./lecturers.component";
import { GroupComponent } from "./group.component";
import { LecturerComponent } from "./lecturer.component";

@NgModule({
	declarations: [
		ScheduleComponent,
		GroupsComponent,
		LecturersComponent,
		GroupComponent,
		LecturerComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		RoutesModule
	]
})
export class ScheduleModule { }

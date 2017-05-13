import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./editor.component";
import { HomeComponent } from "./home.component";
import { ScheduleComponent } from "./schedule.component";

@NgModule({
	declarations: [
		EditorComponent,
		HomeComponent,
		ScheduleComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		AuthModule,
		RoutesModule
	]
})
export class AdminModule { }

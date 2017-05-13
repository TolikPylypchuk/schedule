import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./components/editor.component";
import { HomeComponent } from "./components/home.component";
import { ScheduleComponent } from "./components/schedule.component";

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
export class EditorModule { }

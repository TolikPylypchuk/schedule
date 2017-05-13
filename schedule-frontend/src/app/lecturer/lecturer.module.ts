import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { LecturerComponent } from "./components/lecturer.component";

@NgModule({
	declarations: [
		LecturerComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		AuthModule,
		RoutesModule
	]
})
export class LecturerModule { }

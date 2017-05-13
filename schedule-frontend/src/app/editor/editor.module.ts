import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./components/editor.component";
import { HomeComponent } from "./components/home.component";
import { ScheduleComponent } from "./components/schedule.component";
import { ClassModalComponent } from "./components/class-modal.component";

@NgModule({
	declarations: [
		EditorComponent,
		HomeComponent,
		ScheduleComponent,
		ClassModalComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModalModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		ClassModalComponent
	]
})
export class EditorModule { }

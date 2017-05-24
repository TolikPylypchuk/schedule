import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./admin.component";

import { HomeComponent } from "./components/home.component";
import { AdditionalComponent } from "./components/additional.component";
import { BuildingModalComponent } from "./components/building-modal.component";
import { ClassroomModalComponent } from "./components/classroom-modal.component";
import { ClassroomTypeModalComponent } from "./components/classroom-type-modal.component";
import { FacultyModalComponent } from "./components/faculty-modal.component";
import { SubjectModalComponent } from "./components/subject-modal.component";

@NgModule({
	declarations: [
		AdminComponent,
		HomeComponent,
		AdditionalComponent,
		BuildingModalComponent,
		ClassroomModalComponent,
		ClassroomTypeModalComponent,
		FacultyModalComponent,
		SubjectModalComponent
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
		BuildingModalComponent,
		ClassroomModalComponent,
		ClassroomTypeModalComponent,
		FacultyModalComponent,
		SubjectModalComponent
	]
})
export class AdminModule { }

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./admin.component";

import { UsersComponent } from "./components/users.component";
import { SettingsComponent } from "./components/settings.component";
import { BuildingModalComponent } from "./components/building-modal.component";
import { ClassroomModalComponent } from "./components/classroom-modal.component";
import { ClassroomTypeModalComponent } from "./components/classroom-type-modal.component";
import { FacultyModalComponent } from "./components/faculty-modal.component";
import { SubjectModalComponent } from "./components/subject-modal.component";
import { UserModalComponent } from "./components/user-modal.component";

@NgModule({
	declarations: [
		AdminComponent,
		UsersComponent,
		SettingsComponent,
		BuildingModalComponent,
		ClassroomModalComponent,
		ClassroomTypeModalComponent,
		FacultyModalComponent,
		SubjectModalComponent,
		UserModalComponent
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
		SubjectModalComponent,
		UserModalComponent
	]
})
export class AdminModule { }

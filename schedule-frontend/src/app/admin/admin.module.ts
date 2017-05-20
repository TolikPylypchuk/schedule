import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./components/admin.component";
import { HomeComponent } from "./components/home.component";
import { AdditionalComponent } from "./components/additional.component";
import { BuildingModalComponent } from "./components/building-modal.component";
import { FacultyModalComponent } from "./components/faculty-modal.component";

@NgModule({
	declarations: [
		AdminComponent,
		HomeComponent,
		AdditionalComponent,
		BuildingModalComponent,
		FacultyModalComponent
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
		FacultyModalComponent
	]
})
export class AdminModule { }

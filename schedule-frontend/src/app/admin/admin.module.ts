import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./components/admin.component";
import { HomeComponent } from "./components/home.component";
import { AdditionalComponent } from "./components/additional.component";

@NgModule({
	declarations: [
		AdminComponent,
		HomeComponent,
		AdditionalComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		NgbModalModule,
		AuthModule,
		RoutesModule
	]
})
export class AdminModule { }

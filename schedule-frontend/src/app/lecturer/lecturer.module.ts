import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { LecturerComponent } from "./components/lecturer.component";
import { HomeComponent } from "./components/home.component";
import { WishesComponent } from "./components/wishes.component";
import { WishComponent } from "./components/wish-modal.component";

@NgModule({
	declarations: [
		LecturerComponent,
		HomeComponent,
		WishesComponent,
		WishComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		NgbModalModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		WishComponent
	]
})
export class LecturerModule { }

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { AdminComponent } from "./components/admin.component";

@NgModule({
	declarations: [
		AdminComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		AuthModule,
		RoutesModule
	]
})
export class AdminModule { }

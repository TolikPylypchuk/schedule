import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { LoginComponent } from "./components/login.component";

import { AuthService } from "./services/auth.service";

import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/not-auth.guard";
import { LecturerGuard } from "./guards/lecturer.guard";
import { EditorGuard } from "./guards/editor.guard";
import { AdminGuard } from "./guards/admin.guard";
import { StartPageGuard } from "./guards/start-page.guard";

import { RoutesModule } from "./routes.module";

@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RoutesModule
	],
	providers: [
		AuthService,

		AuthGuard,
		NotAuthGuard,
		LecturerGuard,
		EditorGuard,
		AdminGuard,
		StartPageGuard
	]
})
export class AuthModule { }

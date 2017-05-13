import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { LoginComponent } from "./login.component";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./auth.guard";
import { LecturerGuard } from "./lecturer.guard";
import { EditorGuard } from "./editor.guard";
import { AdminGuard } from "./admin.guard";
import { UserRoleGuard } from "./user-role.guard";

import { RoutesModule } from "./routes.module";

@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		FormsModule,
		HttpModule,
		RoutesModule
	],
	providers: [
		AuthService,

		AuthGuard,
		LecturerGuard,
		EditorGuard,
		AdminGuard,
		UserRoleGuard
	]
})
export class AuthModule { }

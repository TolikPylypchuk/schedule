import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { LoginComponent } from "./components/login.component";

import { AuthService } from "./services/auth.service";

import { AuthGuard } from "./guards/auth.guard";
import { LecturerGuard } from "./guards/lecturer.guard";
import { EditorGuard } from "./guards/editor.guard";
import { AdminGuard } from "./guards/admin.guard";
import { UserRoleGuard } from "./guards/user-role.guard";

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

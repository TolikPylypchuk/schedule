import { NgModule } from "@angular/core";

import { LoginComponent } from "./login.component";

import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UserRoleGuard } from "./user-role.guard";

@NgModule({
	declarations: [
		LoginComponent
	],
	providers: [
		AuthService,
		AuthGuard,
		UserRoleGuard
	]
})
export class AuthModule { }

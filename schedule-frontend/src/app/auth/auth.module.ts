import { NgModule } from "@angular/core";

import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UserRoleGuard } from "./user-role.guard";

@NgModule({
	declarations: [
	],
	providers: [
		AuthService,
		AuthGuard,
		UserRoleGuard
	]
})
export class AuthModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRoleGuard } from "./auth/user-role.guard";

const routes: Routes = [
	{
		path: "",
		redirectTo: "schedule/groups",
		pathMatch: "full",
		canActivate: [ UserRoleGuard ]
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutesModule { }

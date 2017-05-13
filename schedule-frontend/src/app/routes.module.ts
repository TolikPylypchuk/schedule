import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserRoleGuard } from "./auth/auth";

const routes: Routes = [
	{
		path: "",
		redirectTo: "schedule",
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

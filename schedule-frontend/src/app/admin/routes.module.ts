import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";

import { UsersComponent } from "./components/users.component";
import { SettingsComponent } from "./components/settings.component";

import { AuthGuard, AdminGuard } from "../auth/auth";

const routes: Routes = [
	{
		path: "admin",
		component: AdminComponent,
		children: [
			{ path: "settings", component: SettingsComponent },
			{ path: "", component: UsersComponent, pathMatch: "full" }
		],
		canActivate: [ AuthGuard, AdminGuard ],
		canActivateChild: [ AuthGuard, AdminGuard ]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutesModule { }

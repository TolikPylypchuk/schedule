import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./components/admin.component";
import { HomeComponent } from "./components/home.component";
import { AdditionalComponent } from "./components/additional.component";

import { AuthGuard, AdminGuard } from '../auth/auth';

const routes: Routes = [
	{
		path: "admin",
		component: AdminComponent,
		children: [
			{ path: "additional", component: AdditionalComponent },
			{ path: "", component: HomeComponent, pathMatch: "full" }
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

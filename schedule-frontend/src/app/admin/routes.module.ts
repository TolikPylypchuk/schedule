import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AdminComponent } from "./components/admin.component";

import { AuthGuard, AdminGuard } from '../auth/auth';

const routes: Routes = [
	{
		path: "lecturer",
		component: AdminComponent,
		children: [
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

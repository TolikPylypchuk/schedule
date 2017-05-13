import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LecturerComponent } from "./lecturer.component";

import { AuthGuard, LecturerGuard } from '../auth/auth';

const routes: Routes = [
	{
		path: "lecturer",
		component: LecturerComponent,
		children: [
		],
		canActivate: [ AuthGuard, LecturerGuard ],
		canActivateChild: [ AuthGuard, LecturerGuard ]
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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EditorComponent } from "./editor.component";

import { HomeComponent } from "./components/home.component";
import { ScheduleComponent } from "./components/schedule.component";

import { AuthGuard, EditorGuard } from "../auth/auth";

const routes: Routes = [
	{
		path: "editor",
		component: EditorComponent,
		children: [
			{ path: "schedule", component: ScheduleComponent },
			{ path: "", component: HomeComponent, pathMatch: "full" }
		],
		canActivate: [ AuthGuard, EditorGuard ],
		canActivateChild: [ AuthGuard, EditorGuard ]
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

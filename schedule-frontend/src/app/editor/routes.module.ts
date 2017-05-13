import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EditorComponent } from "./editor.component";
import { ScheduleComponent } from './schedule.component';

const routes: Routes = [
	{ path: "editor/schedule", component: ScheduleComponent },
	{ path: "editor", component: EditorComponent }
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

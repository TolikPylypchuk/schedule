import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupsComponent } from "./groups.component";
import { LecturersComponent } from "./lecturers.component";
import { GroupComponent } from "./group.component";
import { LecturerComponent } from "./lecturer.component";

const routes: Routes = [
	{ path: "schedule/groups", component: GroupsComponent },
	{ path: "schedule/lecturers", component: LecturersComponent },
	{ path: "schedule/group/:id", component: GroupComponent },
	{ path: "schedule/lecturer/:id", component: LecturerComponent }
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

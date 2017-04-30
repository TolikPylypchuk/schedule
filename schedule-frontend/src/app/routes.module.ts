import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { StartComponent } from "./schedule/start.component";

const routes: Routes = [
	{ path: "", component: StartComponent }
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


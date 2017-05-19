import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./components/login.component";

import { NotAuthGuard } from "./guards/not-auth.guard";

const routes: Routes = [
	{ path: "login", component: LoginComponent, canActivate: [ NotAuthGuard ] }
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

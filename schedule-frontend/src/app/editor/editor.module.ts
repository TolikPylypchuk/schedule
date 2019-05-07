import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragDropDirectiveModule} from "angular4-drag-drop";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./editor.component";

import { HomeComponent } from "./components/home.component";
import { ScheduleComponent } from "./components/schedule.component";
import { ClassModalComponent } from "./components/class-modal.component";
import { GroupModalComponent } from "./components/group-modal.component";
import { PlanModalComponent } from "./components/plan-modal.component";

@NgModule({
	declarations: [
		EditorComponent,
		HomeComponent,
		ScheduleComponent,
		ClassModalComponent,
		GroupModalComponent,
		PlanModalComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		NgbModalModule,
		NgbModule,
		DragDropDirectiveModule,
		AuthModule,
		RoutesModule
	],
	entryComponents: [
		ClassModalComponent,
		GroupModalComponent,
		PlanModalComponent
	]
})
export class EditorModule { }

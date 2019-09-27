import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { NgbModalModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DragDropDirectiveModule} from "angular4-drag-drop";

import { RoutesModule } from "./routes.module";
import { AuthModule } from "../auth/auth";

import { EditorComponent } from "./editor.component";

import { ScheduleComponent } from "./components/schedule.component";
import { ViewComponent } from "./components/view/view.component";
import { ClassModalComponent } from "./components/class-modal.component";

import { GroupsComponent } from "./components/groups/groups.component";
import { GroupModalComponent } from "./components/groups/group-modal.component";

import { PlansComponent } from "./components/plans/plans.component";
import { PlanModalComponent } from "./components/plans/plan-modal.component";
import { ScheduleService } from "./services/schedule.service";
import { DragAndDropService } from "./services/drag-and-drop.service";

@NgModule({
	declarations: [
		EditorComponent,
		ScheduleComponent,
		ViewComponent,
		ClassModalComponent,
		GroupsComponent,
		GroupModalComponent,
		PlansComponent,
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
	],
	providers: [
		ScheduleService,
		DragAndDropService
	]
})
export class EditorModule { }

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { StartComponent } from './start/start.component';
import * as services from "./services/services";

@NgModule({
    declarations: [
        AppComponent,
        StartComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [
	    services.BuildingService,
        services.ClassService,
        services.ClassroomService,
	    services.FacultyService,
	    services.GroupService,
	    services.LecturerService,
	    services.PlanService,
	    services.SubjectService,
	    services.WishService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }

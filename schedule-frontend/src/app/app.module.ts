import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";

import { AuthModule } from "./auth/auth";
import { ScheduleModule } from "./schedule/schedule";
import { AdminModule } from "./admin/admin";
import { RoutesModule } from "./routes.module";

import * as services from "./services/services";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
	    AuthModule,
	    ScheduleModule,
	    AdminModule,
	    RoutesModule
    ],
    providers: [
	    services.BuildingService,
        services.ClassService,
	    services.ClassroomService,
	    services.ClassroomTypeService,
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

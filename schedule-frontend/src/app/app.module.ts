import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { RoutesModule } from "./routes.module";
import { ScheduleModule } from "./schedule/schedule";
import { AdminModule } from "./admin/admin";

import * as services from "./services/services";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
	    ScheduleModule,
	    AdminModule,
	    RoutesModule
    ],
    providers: [
    	services.AuthService,
	    services.BuildingService,
        services.ClassService,
	    services.ClassroomService,
	    services.ClassroomTypeService,
	    services.FacultyService,
	    services.GroupService,
	    services.UserService,
	    services.PlanService,
	    services.SubjectService,
	    services.WishService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }

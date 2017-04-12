import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { StartComponent } from './start/start.component';
import { ApiService } from "./services/api.service";

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
	    ApiService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }

import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

import { BuildingService } from "./building.service";
import { ClassService } from "./class.service";
import { ClassroomService } from "./classroom.service";
import { FacultyService } from "./faculty.service";
import { GroupService } from "./group.service";
import { LecturerService } from "./lecturer.service";
import { PlanService } from "./plan.service";
import { SubjectService } from "./subject.service";
import { WishService } from "./wish.service";

function handleError(error: Response | any): ErrorObservable {
	let message: string;

	if (error instanceof Response) {
		const body = error.json() || "";
		const err = body.error || JSON.stringify(body);
		message = `${error.status} - ${error.statusText || ""} ${err}`;
	} else {
		message = error.message ? error.message : error.toString();
	}

	console.error(message);

	return Observable.throw(message);
}

export {
	BuildingService,
	ClassService,
	ClassroomService,
	FacultyService,
	GroupService,
	LecturerService,
	PlanService,
	SubjectService,
	WishService,

	handleError
}
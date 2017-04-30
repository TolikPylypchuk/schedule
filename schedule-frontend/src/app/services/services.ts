import { BuildingService } from "./building.service";
import { ClassService } from "./class.service";
import { ClassroomService } from "./classroom.service";
import { FacultyService } from "./faculty.service";
import { GroupService } from "./group.service";
import { LecturerService } from "./lecturer.service";
import { PlanService } from "./plan.service";
import { SubjectService } from "./subject.service";
import { WishService } from "./wish.service";

import {
	getCurrentYear, getCurrentSemester,
	getGroupCourse, getCurrentGroupCourse,
	getGroupName, getCurrentGroupName,
	getClassStart, getClassEnd,
	getDayOfWeekName, getFrequencyName,
	getLecturerInitials, getLecturersString,
	getClassroomsString,
	handleError
} from "./functions";

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

	getCurrentYear,
	getCurrentSemester,
	getGroupCourse,
	getCurrentGroupCourse,
	getGroupName,
	getCurrentGroupName,
	getClassStart,
	getClassEnd,
	getDayOfWeekName,
	getFrequencyName,
	getLecturerInitials,
	getLecturersString,
	getClassroomsString,
	handleError
}

import { Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

import {
	Class, Classroom, DayOfWeek, Frequency, Group, Lecturer, Semester
} from "../models/models";

export function getCurrentYear(): number {
	const now = new Date();
	const year = now.getFullYear();

	return now.getMonth() > 6
		? year
		: year - 1;
}

export function getCurrentSemester(): Semester {
	return new Date().getMonth() > 6
		? Semester.FIRST
		: Semester.SECOND;
}

export function getGroupCourse(group: Group, year: number): number {
	return group
		? year - group.year + 1
		: -1;
}

export function getCurrentGroupCourse(group: Group): number {
	return getGroupCourse(group, getCurrentYear());
}

export function getGroupName(group: Group, year: number): string {
	return group
		? group.name.replace("0", getGroupCourse(group, year).toString())
		: "";
}

export function getCurrentGroupName(group: Group): string {
	return getGroupName(group, getCurrentYear());
}

export function getClassStart(c: Class): string {
	let result = "";

	if (!c)
	{
		return result;
	}

	switch (c.number) {
		case 1:
			result = "8:30";
			break;
		case 2:
			result = "10:10";
			break;
		case 3:
			result = "11:50";
			break;
		case 4:
			result = "13:30";
			break;
		case 5:
			result = "15:05";
			break;
		case 6:
			result = "16:40";
			break;
		case 7:
			result = "18:10";
			break;
		case 8:
			result = "19:40";
			break;
		case 9:
			result = "21:00";
			break;
	}

	return result;
}

export function getClassEnd(c: Class): string {
	let result = "";

	if (!c)
	{
		return result;
	}

	switch (c.number) {
		case 1:
			result = "9:50";
			break;
		case 2:
			result = "11:30";
			break;
		case 3:
			result = "13:10";
			break;
		case 4:
			result = "14:50";
			break;
		case 5:
			result = "16:25";
			break;
		case 6:
			result = "18:00";
			break;
		case 7:
			result = "19:30";
			break;
		case 8:
			result = "20:50";
			break;
		case 9:
			result = "22:20";
			break;
	}

	return result;
}

export function getFrequencyName(frequency: Frequency): string {
	let name = "";

	switch (frequency) {
		case Frequency.DENOMINATOR:
			name = "По знаменнику";
			break;
		case Frequency.NUMERATOR:
			name = "По чисельнику";
			break;
		case Frequency.WEEKLY:
			name = "Щотижня";
			break;
	}

	return name;
}

export function getLecturerInitials(lecturer: Lecturer): string {
	return lecturer
		? `${lecturer.lastName} ${lecturer.firstName[0]}. ${lecturer.middleName[0]}.`
		: "";
}

export function getDayOfWeekName(day: DayOfWeek): string {
	let name = "";

	switch (day) {
		case DayOfWeek.MONDAY:
			name = "Понеділок";
			break;
		case DayOfWeek.TUESDAY:
			name = "Вівторок";
			break;
		case DayOfWeek.WEDNESDAY:
			name = "Середа";
			break;
		case DayOfWeek.THURSDAY:
			name = "Четвер";
			break;
		case DayOfWeek.FRIDAY:
			name = "П'ятниця";
			break;
	}

	return name;
}

export function getClassroomsString(classrooms: Classroom[]): string {
	return classrooms
		? classrooms.reduce(
			(result: string, classroom: Classroom) => `${result}, ${classroom.number}`,
			"").substr(2)
		: "";
}

export function getLecturersString(lecturers: Lecturer[]): string {
	return lecturers
		? lecturers.reduce(
			(result: string, lecturer: Lecturer) =>
				`${result}, ${getLecturerInitials(lecturer)}`,
			"").substr(2)
		: "";
}

export function getGroupsString(groups: Group[]): string {
	return groups
		? groups.reduce(
			(result: string, group: Group) =>
				`${result}, ${getCurrentGroupName(group)}`,
			"").substr(2)
		: "";
}

export function handleError(error: Response | any): ErrorObservable {
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

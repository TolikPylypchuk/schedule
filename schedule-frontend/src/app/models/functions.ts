import {
	Class, Classroom, Group, Lecturer
} from "./models";

export function getCurrentYear(): number {
	const now = new Date();
	const year = now.getFullYear();

	return now.getMonth() > 6
		? year
		: year - 1;
}

export function getCurrentSemester(): number {
	return new Date().getMonth() > 6 ? 1 : 2;
}

export function getSemesterNumber(semester: string): number {
	semester = semester.toLowerCase();
	return semester === "first"
		? 1
		: semester === "second"
			? 2
			: 0;
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

export function getClassType(type: string) {
	let name = "";

	switch (type.toLowerCase()) {
		case "lecture":
			name = "Лекція";
			break;
		case "practice":
			name = "Практична";
			break;
		case "lab":
			name = "Лабораторна";
			break;
	}

	return name;
}

export function getFrequencyName(frequency: string): string {
	let name = "";

	switch (frequency.toLowerCase()) {
		case "weekly":
			name = "Щотижня";
			break;
		case "denominator":
			name = "По знаменнику";
			break;
		case "numerator":
			name = "По чисельнику";
			break;
	}

	return name;
}

export function getLecturerInitials(lecturer: Lecturer): string {
	return lecturer
		? `${lecturer.lastName} ${lecturer.firstName[0]}.\xA0${lecturer.middleName[0]}.`
		: "";
}

export function getDayOfWeekName(day: string): string {
	let name = "";

	switch (day.toLowerCase()) {
		case "monday":
			name = "Понеділок";
			break;
		case "tuesday":
			name = "Вівторок";
			break;
		case "wednesday":
			name = "Середа";
			break;
		case "thursday":
			name = "Четвер";
			break;
		case "friday":
			name = "П'ятниця";
			break;
	}

	return name;
}

export function getDayOfWeekNumber(day: string): number {
	let num = 0;

	switch (day.toLowerCase()) {
		case "monday":
		case "понеділок":
			num = 1;
			break;
		case "tuesday":
		case "вівторок":
			num = 2;
			break;
		case "wednesday":
		case "середа":
			num = 3;
			break;
		case "thursday":
		case "четвер":
			num = 4;
			break;
		case "friday":
		case "п'ятниця":
			num = 5;
			break;
	}

	return num;
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

import {
	Classroom, Group, User
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

export function getClassStart(num: number): string {
	let result = "";

	if (!num)
	{
		return result;
	}

	switch (num) {
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

export function getClassEnd(num: number): string {
	let result = "";

	if (!num)
	{
		return result;
	}

	switch (num) {
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

export function getUserInitials(user: User): string {
	return user
		? `${user.lastName} ${user.firstName[0]}.\xA0${user.middleName[0]}.`
		: "";
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

export function getDayOfWeekName(day: number): string {
	let name = "";

	switch (day) {
		case 1:
			name = "Понеділок";
			break;
		case 2:
			name = "Вівторок";
			break;
		case 3:
			name = "Середа";
			break;
		case 4:
			name = "Четвер";
			break;
		case 5:
			name = "П'ятниця";
			break;
	}

	return name;
}

export function getFrequencyAsEnumString(frequency: string) {
	let result = "";

	switch (frequency.toLowerCase()) {
		case "щотижня":
			result = "weekly";
			break;
		case "по чисельнику":
			result = "numerator";
			break;
		case "по знаменнику":
			result = "denominator";
			break;
	}

	return result;
}

export function getClassroomsAsString(classrooms: Classroom[]): string {
	return classrooms
		? classrooms.reduce(
			(result: string, classroom: Classroom) => `${result}, ${classroom.number}`,
			"").substr(2)
		: "";
}

export function getLecturersAsString(lecturers: User[]): string {
	return lecturers
		? lecturers.reduce(
			(result: string, lecturer: User) =>
				`${result}, ${getUserInitials(lecturer)}`,
			"").substr(2)
		: "";
}

export function getGroupsAsString(groups: Group[]): string {
	return groups
		? groups.reduce(
			(result: string, group: Group) =>
				`${result}, ${getCurrentGroupName(group)}`,
			"").substr(2)
		: "";
}

export function compareLecturersByName(l1: User, l2: User) {
	let result = l1.lastName.localeCompare(l2.lastName);

	if (result === 0)
	{
		result = l1.firstName.localeCompare(l2.firstName);

		if (result === 0)
		{
			result = l1.middleName.localeCompare(l2.middleName);
		}
	}

	return result;
}

export function groupBy<T>(xs: Array<T>, key: string): { key: any, items: T[] }[] {
	return xs.reduce((rv, x) => {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, { } as any);
}

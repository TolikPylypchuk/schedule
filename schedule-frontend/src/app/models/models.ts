export enum Frequency {
	WEEKLY,
	NUMERATOR,
	DENOMINATOR
}

export enum DayOfWeek {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 7
}

export enum Semester {
	FIRST = 1,
	SECOND = 2
}

export interface EntityBase {
	id: number;
}

export interface Building extends EntityBase {
	name: string;
	street: string;
	number: string;
}

export interface Class extends EntityBase {
	number: number;
	frequency: Frequency;
	dayOfWeek: DayOfWeek;
	year: number;
	semester: Semester;
}

export interface Classroom extends EntityBase {
	number: string;
	type: string;
	capacity: number;
}

export interface Faculty extends EntityBase {
	name: string;
}

export interface Group extends EntityBase {
	name: string;
	numStudents: number;
	year: number;
}

export interface Lecturer extends EntityBase {
	firstName: string;
	middleName: string;
	lastName: string;
	position: string;
}

export interface Plan extends EntityBase {
	numLectures: number;
	numPractice: number;
	numLabs: number;
	year: number;
	semester: Semester;
}

export interface Subject extends EntityBase {
	name: string;
	classroomType: string;
}

export interface Wish extends EntityBase {
	startTime: string;
	endTime: string;
	isSuitable: boolean;
	comment: string;
	year: number;
	semester: Semester;
}

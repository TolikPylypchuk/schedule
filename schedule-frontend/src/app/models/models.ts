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
	frequency: string;
	dayOfWeek: string;
	year: number;
	semester: string;
	type: string;
}

export interface Classroom extends EntityBase {
	number: string;
	type: string;
	capacity: number;
}

export interface ClassroomType extends EntityBase {
	type: string;
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
	semester: string;
}

export interface Subject extends EntityBase {
	name: string;
}

export interface Wish extends EntityBase {
	startTime: string;
	endTime: string;
	isSuitable: boolean;
	comment: string;
	year: number;
	semester: string;
}

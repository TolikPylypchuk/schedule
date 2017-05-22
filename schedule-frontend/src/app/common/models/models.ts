export interface EntityBase {
	id?: number;
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
	semester: number;
	type: string;
	classroomType: ClassroomType;
	subject: Subject;
	classrooms?: Classroom[];
	groups?: Group[];
	lecturers?: User[];
}

export interface Classroom extends EntityBase {
	number: string;
	capacity: number;
	type: ClassroomType;
	building: Building;
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
	faculty: Faculty;
}

export interface Plan extends EntityBase {
	numLectures: number;
	numPractice: number;
	numLabs: number;
	year: number;
	semester: number;
	subject: Subject;
	group: Group;
}

export interface Role extends EntityBase {
	name: string;
}

export interface Subject extends EntityBase {
	name: string;
}

export interface User extends EntityBase {
	username?: string;
	password?: string;
	authorities: Role[],

	firstName: string;
	middleName: string;
	lastName: string;
	position: string;
	faculty: Faculty;
}

export interface Wish extends EntityBase {
	dayOfWeek: string;
	startTime: string;
	endTime: string;
	suitable: boolean;
	comment: string;
	year: number;
	semester: number;
	lecturer: User;
}

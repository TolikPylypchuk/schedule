import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import * as models from "../models/models";

@Injectable()
export class ApiService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getBuildings(): Observable<models.Building[]> {
		return this.http.get("api/buildings")
						.map(response =>
							response.status === 200
								? response.json() as models.Building[]
								: null);
	}

	getBuilding(id: number): Observable<models.Building> {
		return this.http.get(`api/buildings/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Building
					: null);
	}

	getClasses(): Observable<models.Class[]> {
		return this.http.get("api/classes")
			.map(response =>
				response.status === 200
					? response.json() as models.Class[]
					: null);
	}

	getClass(id: number): Observable<models.Class> {
		return this.http.get(`api/classes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Class
					: null);
	}

	getClassrooms(): Observable<models.Classroom[]> {
		return this.http.get("api/classrooms")
			.map(response =>
				response.status === 200
					? response.json() as models.Classroom[]
					: null);
	}

	getClassroom(id: number): Observable<models.Classroom> {
		return this.http.get(`api/classrooms/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Classroom
					: null);
	}

	getFaculties(): Observable<models.Faculty[]> {
		return this.http.get("api/faculties")
			.map(response =>
				response.status === 200
					? response.json() as models.Faculty[]
					: null);
	}

	getFaculty(id: number): Observable<models.Faculty> {
		return this.http.get(`api/faculties/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Faculty
					: null);
	}

	getGroups(): Observable<models.Group[]> {
		return this.http.get("api/groups")
			.map(response =>
				response.status === 200
					? response.json() as models.Group[]
					: null);
	}

	getGroup(id: number): Observable<models.Group> {
		return this.http.get(`api/groups/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Group
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<models.Group[]> {
		return this.http.get(`api/groups/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Group[]
					: null);
	}

	getLecturers(): Observable<models.Lecturer[]> {
		return this.http.get("api/lecturers")
			.map(response =>
				response.status === 200
					? response.json() as models.Lecturer[]
					: null);
	}

	getLecturer(id: number): Observable<models.Lecturer> {
		return this.http.get(`api/lecturers/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Lecturer
					: null);
	}

	getPlans(): Observable<models.Plan[]> {
		return this.http.get("api/plans")
			.map(response =>
				response.status === 200
					? response.json() as models.Plan[]
					: null);
	}

	getPlan(id: number): Observable<models.Plan> {
		return this.http.get(`api/plans/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Plan
					: null);
	}

	getSubjects(): Observable<models.Subject[]> {
		return this.http.get("api/subjects")
			.map(response =>
				response.status === 200
					? response.json() as models.Subject[]
					: null);
	}

	getSubject(id: number): Observable<models.Subject> {
		return this.http.get(`api/subjects/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Subject
					: null);
	}

	getWishes(): Observable<models.Wish[]> {
		return this.http.get("api/wishes")
			.map(response =>
				response.status === 200
					? response.json() as models.Wish[]
					: null);
	}

	getWish(id: number): Observable<models.Wish> {
		return this.http.get(`api/wishes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as models.Wish
					: null);
	}
}

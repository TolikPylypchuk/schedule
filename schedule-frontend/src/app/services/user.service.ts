import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import {Lecturer, Subject} from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class UserService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getLecturers(): Observable<Lecturer[]> {
		return this.http.get(`${prefix}/lecturers`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer[]
					: null);
	}

	getLecturer(id: number): Observable<Lecturer> {
		return this.http.get(`${prefix}/lecturers/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer
					: null);
	}

	getLecturersByFaculty(facultyId: number): Observable<Lecturer[]> {
		return this.http.get(`${prefix}/lecturers/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer[]
					: null);
	}

	getLecturersBySubject(subjectId: number): Observable<Lecturer[]> {
		return this.http.get(`${prefix}/lecturers/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer[]
					: null);
	}

	getLecturersByClass(classId: number): Observable<Lecturer[]> {
		return this.http.get(`${prefix}/lecturers/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer[]
					: null);
	}

	getLecturerByWish(wishId: number): Observable<Lecturer> {
		return this.http.get(`${prefix}/lecturer/wishId/${wishId}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer
					: null);
	}

	addLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.post(
			`${prefix}/lecturers/`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.put(
			`${prefix}/lecturers/${lecturer.id}`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.delete(`${prefix}/lecturers/${lecturer.id}`)
			.catch(handleError);
	}
}


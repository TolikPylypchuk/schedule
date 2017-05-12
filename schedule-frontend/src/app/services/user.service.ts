import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import {User, Subject} from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class UserService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getLecturers(): Observable<User[]> {
		return this.http.get(`${prefix}/lecturers`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturer(id: number): Observable<User> {
		return this.http.get(`${prefix}/lecturers/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	getLecturersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(`${prefix}/lecturers/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersBySubject(subjectId: number): Observable<User[]> {
		return this.http.get(`${prefix}/lecturers/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersByClass(classId: number): Observable<User[]> {
		return this.http.get(`${prefix}/lecturers/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturerByWish(wishId: number): Observable<User> {
		return this.http.get(`${prefix}/lecturer/wishId/${wishId}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	addLecturer(lecturer: User): Observable<Response> {
		return this.http.post(
			`${prefix}/lecturers/`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateLecturer(lecturer: User): Observable<Response> {
		return this.http.put(
			`${prefix}/lecturers/${lecturer.id}`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteLecturer(lecturer: User): Observable<Response> {
		return this.http.delete(`${prefix}/lecturers/${lecturer.id}`)
			.catch(handleError);
	}
}


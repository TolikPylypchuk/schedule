import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { User } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class UserService {
	private api = "http://localhost:8080";
	private headers = new Headers({ "Content-Type": "application/json" });

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getLecturers(): Observable<User[]> {
		return this.http.get(`${this.api}/lecturers`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturer(id: number): Observable<User> {
		return this.http.get(`${this.api}/lecturers/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	getLecturersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(`${this.api}/lecturers/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersBySubject(subjectId: number): Observable<User[]> {
		return this.http.get(`${this.api}/lecturers/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersByClass(classId: number): Observable<User[]> {
		return this.http.get(`${this.api}/lecturers/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturerByWish(wishId: number): Observable<User> {
		return this.http.get(`${this.api}/lecturer/wishId/${wishId}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	addLecturer(lecturer: User): Observable<Response> {
		return this.http.post(
			`${this.api}/lecturers/`,
			JSON.stringify(lecturer),
			{ headers: this.headers })
			.catch(handleError);
	}

	updateLecturer(lecturer: User): Observable<Response> {
		return this.http.put(
			`${this.api}/lecturers/${lecturer.id}`,
			JSON.stringify(lecturer),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteLecturer(lecturer: User): Observable<Response> {
		return this.http.delete(`${this.api}/lecturers/${lecturer.id}`)
			.catch(handleError);
	}
}


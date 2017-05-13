import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { User } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class UserService {
	private usersUrl = "http://localhost:8080/users";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getUsers(): Observable<User[]> {
		return this.http.get(this.usersUrl)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturers(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/lecturer`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getEditors(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/editor`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getAdmins(): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/role/admin`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getUser(id: number): Observable<User> {
		return this.http.get(`${this.usersUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	getUsersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/lecturer/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getEditorsByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/editor/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersBySubject(subjectId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturersByClass(classId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturerByWish(wishId: number): Observable<User> {
		return this.http.get(`${this.usersUrl}/lecturer/wishId/${wishId}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	addLecturer(lecturer: User): Observable<Response> {
		return this.http.post(
			this.usersUrl,
			JSON.stringify(lecturer),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateLecturer(lecturer: User): Observable<Response> {
		return this.http.put(
			`${this.usersUrl}/${lecturer.id}`,
			JSON.stringify(lecturer),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteLecturer(lecturer: User): Observable<Response> {
		return this.http.delete(
			`${this.usersUrl}/${lecturer.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

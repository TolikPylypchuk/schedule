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

	getAvailableLecturers(
		facultyId: number,
		subjectId: number,
		day: number,
		num: number,
		frequency: string): Observable<User[]> {
		return this.http.get(
			`${this.usersUrl}/role/lecturer/available/facultyId/${facultyId}` +
			`/subjectId/${subjectId}/day/${day}/number/${num}/frequency/${frequency}`)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	addUser(user: User, roles: string): Observable<Response> {
		return this.http.post(
			`${this.usersUrl}?roles=${roles}`,
			JSON.stringify(user),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	addUserToRole(user: User, role: string): Observable<Response> {
		return this.http.post(
			`${this.usersUrl}/${user.id}/roles/add/${role}`,
			{ },
			{ headers: getHeaders() })
			.catch(handleError);
	}

	removeUserFromRole(user: User, role: string): Observable<Response> {
		return this.http.post(
			`${this.usersUrl}/${user.id}/roles/remove/${role}`,
			{ },
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateUser(user: User): Observable<Response> {
		return this.http.put(
			`${this.usersUrl}/${user.id}`,
			JSON.stringify(user),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteUser(user: User): Observable<Response> {
		return this.http.delete(
			`${this.usersUrl}/${user.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

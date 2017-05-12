import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { User } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class UserService {
	private usersUrl = "http://localhost:8080/users";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
	}

	getLecturers(): Observable<User[]> {
		return this.http.get(this.usersUrl)
			.map(response =>
				response.status === 200
					? response.json() as User[]
					: null);
	}

	getLecturer(id: number): Observable<User> {
		return this.http.get(`${this.usersUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as User
					: null);
	}

	getLecturersByFaculty(facultyId: number): Observable<User[]> {
		return this.http.get(`${this.usersUrl}/facultyId/${facultyId}`)
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
			{ headers: this.headers })
			.catch(handleError);
	}

	updateLecturer(lecturer: User): Observable<Response> {
		return this.http.put(
			`${this.usersUrl}/${lecturer.id}`,
			JSON.stringify(lecturer),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteLecturer(lecturer: User): Observable<Response> {
		return this.http.delete(
			`${this.usersUrl}/${lecturer.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}

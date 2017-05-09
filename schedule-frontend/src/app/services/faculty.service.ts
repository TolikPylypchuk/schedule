import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Faculty } from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class FacultyService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getFaculties(): Observable<Faculty[]> {
		return this.http.get(`${prefix}/faculties`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty[]
					: null);
	}

	getFaculty(id: number): Observable<Faculty> {
		return this.http.get(`${prefix}/faculties/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty
					: null);
	}

	addFaculty(faculty: Faculty): Observable<Response> {
		return this.http.post(
			`${prefix}/faculties/`,
			JSON.stringify(faculty),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateFaculty(faculty: Faculty): Observable<Response> {
		return this.http.put(
			`${prefix}/faculties/${faculty.id}`,
			JSON.stringify(faculty),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteFaculty(faculty: Faculty): Observable<Response> {
		return this.http.delete(`${prefix}/faculties/${faculty.id}`)
			.catch(handleError);
	}
}


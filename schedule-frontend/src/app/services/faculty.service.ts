import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Faculty } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class FacultyService {
	private api = "http://localhost:8080";
	private headers = new Headers({ "Content-Type": "application/json" });

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getFaculties(): Observable<Faculty[]> {
		return this.http.get(`${this.api}/faculties`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty[]
					: null);
	}

	getFaculty(id: number): Observable<Faculty> {
		return this.http.get(`${this.api}/faculties/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty
					: null);
	}

	addFaculty(faculty: Faculty): Observable<Response> {
		return this.http.post(
			`${this.api}/faculties/`,
			JSON.stringify(faculty),
			{ headers: this.headers })
			.catch(handleError);
	}

	updateFaculty(faculty: Faculty): Observable<Response> {
		return this.http.put(
			`${this.api}/faculties/${faculty.id}`,
			JSON.stringify(faculty),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteFaculty(faculty: Faculty): Observable<Response> {
		return this.http.delete(`${this.api}/faculties/${faculty.id}`)
			.catch(handleError);
	}
}


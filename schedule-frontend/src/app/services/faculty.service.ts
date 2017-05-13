import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Faculty } from "../models/models";
import { handleError, getHeaders } from "../common/functions";

@Injectable()
export class FacultyService {
	private facultiesUrl = "http://localhost:8080/faculties";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getFaculties(): Observable<Faculty[]> {
		return this.http.get(this.facultiesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Faculty[]
					: null);
	}

	getFaculty(id: number): Observable<Faculty> {
		return this.http.get(`${this.facultiesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty
					: null);
	}

	addFaculty(faculty: Faculty): Observable<Response> {
		return this.http.post(
			this.facultiesUrl,
			JSON.stringify(faculty),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateFaculty(faculty: Faculty): Observable<Response> {
		return this.http.put(
			`${this.facultiesUrl}/${faculty.id}`,
			JSON.stringify(faculty),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteFaculty(faculty: Faculty): Observable<Response> {
		return this.http.delete(
			`${this.facultiesUrl}/${faculty.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

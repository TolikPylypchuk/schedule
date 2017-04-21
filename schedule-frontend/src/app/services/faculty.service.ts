import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Faculty } from "../models/models";

@Injectable()
export class FacultyService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getFaculties(): Observable<Faculty[]> {
		return this.http.get("api/faculties")
			.map(response =>
				response.status === 200
					? response.json() as Faculty[]
					: null);
	}

	getFaculty(id: number): Observable<Faculty> {
		return this.http.get(`api/faculties/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Faculty
					: null);
	}
}


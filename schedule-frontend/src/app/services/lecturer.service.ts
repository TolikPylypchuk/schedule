import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Lecturer } from "../models/models";

@Injectable()
export class LecturerService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getLecturers(): Observable<Lecturer[]> {
		return this.http.get("api/lecturers")
			.map(response =>
				response.status === 200
					? response.json() as Lecturer[]
					: null);
	}

	getLecturer(id: number): Observable<Lecturer> {
		return this.http.get(`api/lecturers/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Lecturer
					: null);
	}
}


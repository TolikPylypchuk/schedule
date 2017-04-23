import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Lecturer } from "../models/models";
import {handleError} from "./services";

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

	addLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.post(
			`api/lecturers/`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.put(
			`api/lecturers/${lecturer.id}`,
			JSON.stringify(lecturer),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteLecturer(lecturer: Lecturer): Observable<Response> {
		return this.http.delete(`api/lecturers/${lecturer.id}`)
			.catch(handleError);
	}
}


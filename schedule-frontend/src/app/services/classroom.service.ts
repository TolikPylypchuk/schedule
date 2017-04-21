import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Classroom } from "../models/models";

@Injectable()
export class ClassroomService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClassrooms(): Observable<Classroom[]> {
		return this.http.get("api/classrooms")
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getClassroom(id: number): Observable<Classroom> {
		return this.http.get(`api/classrooms/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom
					: null);
	}
}


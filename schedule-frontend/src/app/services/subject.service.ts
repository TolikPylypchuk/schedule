import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Subject } from "../models/models";

@Injectable()
export class SubjectService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getSubjects(): Observable<Subject[]> {
		return this.http.get("api/subjects")
			.map(response =>
				response.status === 200
					? response.json() as Subject[]
					: null);
	}

	getSubject(id: number): Observable<Subject> {
		return this.http.get(`api/subjects/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}
}


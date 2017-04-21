import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Class } from "../models/models";

@Injectable()
export class ClassService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClasses(): Observable<Class[]> {
		return this.http.get("api/classes")
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClass(id: number): Observable<Class> {
		return this.http.get(`api/classes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Class
					: null);
	}
}



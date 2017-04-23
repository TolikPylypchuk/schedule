import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Class } from "../models/models";
import {handleError} from "./services";

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

	getClassesByGroup(groupId: number): Observable<Class[]> {
		return this.http.get(`api/classes/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	addClass(c: Class): Observable<Response> {
		return this.http.post(
			`api/cs/`,
			JSON.stringify(c),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateClass(c: Class): Observable<Response> {
		return this.http.put(
			`api/cs/${c.id}`,
			JSON.stringify(c),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteClass(c: Class): Observable<Response> {
		return this.http.delete(`api/cs/${c.id}`)
			.catch(handleError);
	}
}



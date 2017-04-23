import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Classroom } from "../models/models";
import {handleError} from "./services";

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

	addClassroom(classroom: Classroom): Observable<Response> {
		return this.http.post(
			`api/classrooms/`,
			JSON.stringify(classroom),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateClassroom(classroom: Classroom): Observable<Response> {
		return this.http.put(
			`api/classrooms/${classroom.id}`,
			JSON.stringify(classroom),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteClassroom(classroom: Classroom): Observable<Response> {
		return this.http.delete(`api/classrooms/${classroom.id}`)
			.catch(handleError);
	}
}


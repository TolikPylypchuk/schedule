import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Subject } from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class SubjectService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getSubjects(): Observable<Subject[]> {
		return this.http.get(`${prefix}/subjects`)
			.map(response =>
				response.status === 200
					? response.json() as Subject[]
					: null);
	}

	getSubject(id: number): Observable<Subject> {
		return this.http.get(`${prefix}/subjects/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	getSubjectByPlan(planId: number): Observable<Subject> {
		return this.http.get(`${prefix}/subjects/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	getSubjectByClass(classId: number): Observable<Subject> {
		return this.http.get(`${prefix}/subjects/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	addSubject(subject: Subject): Observable<Response> {
		return this.http.post(
			`${prefix}/subjects/`,
			JSON.stringify(subject),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateSubject(subject: Subject): Observable<Response> {
		return this.http.put(
			`${prefix}/subjects/${subject.id}`,
			JSON.stringify(subject),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteSubject(subject: Subject): Observable<Response> {
		return this.http.delete(`${prefix}/subjects/${subject.id}`)
			.catch(handleError);
	}
}


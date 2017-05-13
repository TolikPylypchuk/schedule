import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Subject } from "../models/models";
import { handleError, getHeaders } from "../common/functions";

@Injectable()
export class SubjectService {
	private subjectsUrl = "http://localhost:8080/subjects";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getSubjects(): Observable<Subject[]> {
		return this.http.get(this.subjectsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Subject[]
					: null);
	}

	getSubject(id: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	getSubjectByPlan(planId: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	getSubjectByClass(classId: number): Observable<Subject> {
		return this.http.get(`${this.subjectsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Subject
					: null);
	}

	addSubject(subject: Subject): Observable<Response> {
		return this.http.post(
			this.subjectsUrl,
			JSON.stringify(subject),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateSubject(subject: Subject): Observable<Response> {
		return this.http.put(
			`${this.subjectsUrl}/${subject.id}`,
			JSON.stringify(subject),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteSubject(subject: Subject): Observable<Response> {
		return this.http.delete(
			`${this.subjectsUrl}/${subject.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

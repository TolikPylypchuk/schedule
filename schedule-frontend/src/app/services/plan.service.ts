import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Plan } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class PlanService {
	private api = "http://localhost:8080";
	private headers = new Headers({ "Content-Type": "application/json" });

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getPlans(): Observable<Plan[]> {
		return this.http.get(`${this.api}/plans`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlan(id: number): Observable<Plan> {
		return this.http.get(`${this.api}/plans/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan
					: null);
	}

	getPlansByGroup(groupId: number): Observable<Plan[]> {
		return this.http.get(`${this.api}/plans/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansByGroupAndYearAndSemester(
		groupId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.api}/plans/groupId/${groupId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansBySubject(subjectId: number): Observable<Plan[]> {
		return this.http.get(`${this.api}/plans/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansBySubjectAndYearAndSemester(
		subjectId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.api}/plans/subjectId/${subjectId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	addPlan(plan: Plan): Observable<Response> {
		return this.http.post(
			`${this.api}/plans/`,
			JSON.stringify(plan),
			{ headers: this.headers })
			.catch(handleError);
	}

	updatePlan(plan: Plan): Observable<Response> {
		return this.http.put(
			`${this.api}/plans/${plan.id}`,
			JSON.stringify(plan),
			{ headers: this.headers })
			.catch(handleError);
	}

	deletePlan(plan: Plan): Observable<Response> {
		return this.http.delete(`${this.api}/plans/${plan.id}`)
			.catch(handleError);
	}
}


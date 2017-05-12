import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { Plan } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class PlanService {
	private plansUrl = "http://localhost:8080/plans";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
	}

	getPlans(): Observable<Plan[]> {
		return this.http.get(this.plansUrl)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlan(id: number): Observable<Plan> {
		return this.http.get(`${this.plansUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan
					: null);
	}

	getPlansByGroup(groupId: number): Observable<Plan[]> {
		return this.http.get(`${this.plansUrl}/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansByGroupAndYearAndSemester(
		groupId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.plansUrl}/groupId/${groupId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansBySubject(subjectId: number): Observable<Plan[]> {
		return this.http.get(`${this.plansUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlansBySubjectAndYearAndSemester(
		subjectId: number, year: number, semester: number): Observable<Plan[]> {
		return this.http.get(
			`${this.plansUrl}/subjectId/${subjectId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	addPlan(plan: Plan): Observable<Response> {
		return this.http.post(
			this.plansUrl,
			JSON.stringify(plan),
			{ headers: this.headers })
			.catch(handleError);
	}

	updatePlan(plan: Plan): Observable<Response> {
		return this.http.put(
			`${this.plansUrl}/${plan.id}`,
			JSON.stringify(plan),
			{ headers: this.headers })
			.catch(handleError);
	}

	deletePlan(plan: Plan): Observable<Response> {
		return this.http.delete(
			`${this.plansUrl}/${plan.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}


import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Plan } from "../models/models";
import {handleError} from "./services";

@Injectable()
export class PlanService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getPlans(): Observable<Plan[]> {
		return this.http.get("api/plans")
			.map(response =>
				response.status === 200
					? response.json() as Plan[]
					: null);
	}

	getPlan(id: number): Observable<Plan> {
		return this.http.get(`api/plans/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Plan
					: null);
	}

	addPlan(plan: Plan): Observable<Response> {
		return this.http.post(
			`api/plans/`,
			JSON.stringify(plan),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updatePlan(plan: Plan): Observable<Response> {
		return this.http.put(
			`api/plans/${plan.id}`,
			JSON.stringify(plan),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deletePlan(plan: Plan): Observable<Response> {
		return this.http.delete(`api/plans/${plan.id}`)
			.catch(handleError);
	}
}


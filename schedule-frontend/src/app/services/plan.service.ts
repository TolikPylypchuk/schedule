import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Plan } from "../models/models";

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
}


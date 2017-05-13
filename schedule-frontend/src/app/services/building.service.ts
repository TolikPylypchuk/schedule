import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Building } from "../models/models";
import { handleError, getHeaders } from "../common/functions";

@Injectable()
export class BuildingService {
	private buildingsUrl = "http://localhost:8080/buildings";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getBuildings(): Observable<Building[]> {
		return this.http.get(this.buildingsUrl)
						.map(response =>
							response.status === 200
								? response.json() as Building[]
								: null)
						.catch(handleError);
	}

	getBuilding(id: number): Observable<Building> {
		return this.http.get(`${this.buildingsUrl}/${id}`)
						.map(response =>
							response.status === 200
								? response.json() as Building
								: null)
						.catch(handleError);
	}

	addBuilding(building: Building): Observable<Response> {
		return this.http.post(
			this.buildingsUrl,
			JSON.stringify(building),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateBuilding(building: Building): Observable<Response> {
		return this.http.put(
			`${this.buildingsUrl}/${building.id}`,
			JSON.stringify(building),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteBuilding(building: Building): Observable<Response> {
		return this.http.delete(
			`${this.buildingsUrl}/${building.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

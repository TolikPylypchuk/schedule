import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Building } from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class BuildingService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getBuildings(): Observable<Building[]> {
		return this.http.get(`${prefix}/buildings`)
						.map(response =>
							response.status === 200
								? response.json() as Building[]
								: null)
						.catch(handleError);
	}

	getBuilding(id: number): Observable<Building> {
		return this.http.get(`${prefix}/buildings/${id}`)
						.map(response =>
							response.status === 200
								? response.json() as Building
								: null)
						.catch(handleError);
	}

	addBuilding(building: Building): Observable<Response> {
		return this.http.post(
			`${prefix}/buildings/`,
			JSON.stringify(building),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateBuilding(building: Building): Observable<Response> {
		return this.http.put(
			`${prefix}/buildings/${building.id}`,
			JSON.stringify(building),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteBuilding(building: Building): Observable<Response> {
		return this.http.delete(`${prefix}/buildings/${building.id}`)
						.catch(handleError);
	}
}

import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Building } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class BuildingService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getBuildings(): Observable<Building[]> {
		return this.http.get("api/buildings")
						.map(response =>
							response.status === 200
								? response.json() as Building[]
								: null)
						.catch(handleError);
	}

	getBuilding(id: number): Observable<Building> {
		return this.http.get(`api/buildings/${id}`)
						.map(response =>
							response.status === 200
								? response.json() as Building
								: null)
						.catch(handleError);
	}

	addBuilding(building: Building): Observable<Response> {
		return this.http.post(
			`api/buildings/`,
			JSON.stringify(building),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateBuilding(building: Building): Observable<Response> {
		return this.http.put(
			`api/buildings/${building.id}`,
			JSON.stringify(building),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteBuilding(building: Building): Observable<Response> {
		return this.http.delete(`api/buildings/${building.id}`)
						.catch(handleError);
	}
}


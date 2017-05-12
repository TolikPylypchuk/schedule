import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { Building } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class BuildingService {
	private buildingsUrl = "http://localhost:8080/buildings";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
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
			{ headers: this.headers })
			.catch(handleError);
	}

	updateBuilding(building: Building): Observable<Response> {
		return this.http.put(
			`${this.buildingsUrl}/${building.id}`,
			JSON.stringify(building),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteBuilding(building: Building): Observable<Response> {
		return this.http.delete(
			`${this.buildingsUrl}/${building.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}

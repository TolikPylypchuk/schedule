import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Group } from "../models/models";

@Injectable()
export class GroupService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getGroups(): Observable<Group[]> {
		return this.http.get("api/groups")
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroup(id: number): Observable<Group> {
		return this.http.get(`api/groups/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`api/groups/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}
}


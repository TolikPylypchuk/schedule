import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Group } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class GroupService {
	private api = "http://localhost:8080";
	private headers = new Headers({ "Content-Type": "application/json" });

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getGroups(): Observable<Group[]> {
		return this.http.get(`${this.api}/groups`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroup(id: number): Observable<Group> {
		return this.http.get(`${this.api}/groups/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	getGroupsByYear(year: number): Observable<Group[]> {
		return this.http.get(`${this.api}/groups/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`${this.api}/groups/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYear(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.api}/groups/facultyId/${facultyId}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYearSince(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.api}/groups/facultyId/${facultyId}/since/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByClass(classId: number): Observable<Group[]> {
		return this.http.get(`${this.api}/groups/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupByPlan(planId: number): Observable<Group> {
		return this.http.get(`${this.api}/group/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	addGroup(group: Group): Observable<Response> {
		return this.http.post(
			`${this.api}/groups/`,
			JSON.stringify(group),
			{ headers: this.headers })
			.catch(handleError);
	}

	updateGroup(group: Group): Observable<Response> {
		return this.http.put(
			`${this.api}/groups/${group.id}`,
			JSON.stringify(group),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteGroup(group: Group): Observable<Response> {
		return this.http.delete(`${this.api}/groups/${group.id}`)
			.catch(handleError);
	}
}

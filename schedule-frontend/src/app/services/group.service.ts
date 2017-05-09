import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Group } from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class GroupService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getGroups(): Observable<Group[]> {
		return this.http.get(`${prefix}/groups`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroup(id: number): Observable<Group> {
		return this.http.get(`${prefix}/groups/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	getGroupsByYear(year: number): Observable<Group[]> {
		return this.http.get(`${prefix}/groups/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`${prefix}/groups/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYear(facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(`${prefix}/groups/facultyId/${facultyId}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYearSince(facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(`${prefix}/groups/facultyId/${facultyId}/since/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByClass(classId: number): Observable<Group[]> {
		return this.http.get(`${prefix}/groups/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupByPlan(planId: number): Observable<Group> {
		return this.http.get(`${prefix}/group/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	addGroup(group: Group): Observable<Response> {
		return this.http.post(
			`${prefix}/groups/`,
			JSON.stringify(group),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateGroup(group: Group): Observable<Response> {
		return this.http.put(
			`${prefix}/groups/${group.id}`,
			JSON.stringify(group),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteGroup(group: Group): Observable<Response> {
		return this.http.delete(`${prefix}/groups/${group.id}`)
			.catch(handleError);
	}
}

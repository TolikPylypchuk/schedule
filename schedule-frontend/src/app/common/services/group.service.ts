import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Group } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class GroupService {
	private groupsUrl = "http://localhost:8080/groups";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getGroups(): Observable<Group[]> {
		return this.http.get(this.groupsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroup(id: number): Observable<Group> {
		return this.http.get(`${this.groupsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	getGroupsByYear(year: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYear(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/facultyId/${facultyId}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYearSince(
		facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(
			`${this.groupsUrl}/facultyId/${facultyId}/since/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByClass(classId: number): Observable<Group[]> {
		return this.http.get(`${this.groupsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupByPlan(planId: number): Observable<Group> {
		return this.http.get(`${this.groupsUrl}/group/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	addGroup(group: Group): Observable<Response> {
		return this.http.post(
			this.groupsUrl,
			JSON.stringify(group),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateGroup(group: Group): Observable<Response> {
		return this.http.put(
			`${this.groupsUrl}/${group.id}`,
			JSON.stringify(group),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteGroup(group: Group): Observable<Response> {
		return this.http.delete(
			`${this.groupsUrl}/${group.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}
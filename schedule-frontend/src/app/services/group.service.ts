import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Group } from "../models/models";
import {handleError} from "./services";

@Injectable()
export class GroupService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getCurrentYear(): number {
		const now = new Date();
		const year = now.getFullYear();

		return now.getMonth() > 6
			? year
			: year - 1;
	}

	getCourse(group: Group, year: number): number {
		return year - group.year + 1;
	}

	getCurrentCourse(group: Group): number{
		return this.getCourse(group, this.getCurrentYear());
	}

	getName(group: Group, year: number): string {
		return group.name.replace("0", this.getCourse(group, year).toString());
	}

	getCurrentName(group: Group): string {
		return this.getName(group, this.getCurrentYear());
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

	getGroupsByYear(year: number): Observable<Group[]> {
		return this.http.get(`api/groups/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFaculty(facultyId: number): Observable<Group[]> {
		return this.http.get(`api/groups/facultyId/${facultyId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYear(facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(`api/groups/facultyId/${facultyId}/year/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByFacultyAndYearSince(facultyId: number, year: number): Observable<Group[]> {
		return this.http.get(`api/groups/facultyId/${facultyId}/since/${year}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupsByClass(classId: number): Observable<Group[]> {
		return this.http.get(`api/groups/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group[]
					: null);
	}

	getGroupByPlan(planId: number): Observable<Group> {
		return this.http.get(`api/group/planId/${planId}`)
			.map(response =>
				response.status === 200
					? response.json() as Group
					: null);
	}

	addGroup(group: Group): Observable<Response> {
		return this.http.post(
			`api/groups/`,
			JSON.stringify(group),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateGroup(group: Group): Observable<Response> {
		return this.http.put(
			`api/groups/${group.id}`,
			JSON.stringify(group),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteGroup(group: Group): Observable<Response> {
		return this.http.delete(`api/groups/${group.id}`)
			.catch(handleError);
	}
}

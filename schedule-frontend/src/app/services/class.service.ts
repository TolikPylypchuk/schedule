import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Class } from "../models/models";
import { handleError, getHeaders } from "../common/functions";

@Injectable()
export class ClassService {
	private classesUrl = "http://localhost:8080/classes";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClasses(): Observable<Class[]> {
		return this.http.get(this.classesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClass(id: number): Observable<Class> {
		return this.http.get(`${this.classesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Class
					: null);
	}

	getClassesByGroup(groupId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/groupId/${groupId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByGroupAndYearAndSemester(
		groupId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/groupId/${groupId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByClassroom(classroomId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/classroomId/${classroomId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByClassroomAndYearAndSemester(
		classroomId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/classroomId/${classroomId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByLecturer(lecturerId: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByLecturerAndYearAndSemester(
		lecturerId: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/lecturerId/${lecturerId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByDayOfWeek(day: number): Observable<Class[]> {
		return this.http.get(`${this.classesUrl}/day/${day}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	getClassesByDayOfWeekAndYearAndSemester(
		day: number, year: number, semester: number): Observable<Class[]> {
		return this.http.get(
			`${this.classesUrl}/day/${day}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Class[]
					: null);
	}

	addClass(c: Class): Observable<Response> {
		return this.http.post(
			this.classesUrl,
			JSON.stringify(c),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateClass(c: Class): Observable<Response> {
		return this.http.put(
			`${this.classesUrl}/${c.id}`,
			JSON.stringify(c),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteClass(c: Class): Observable<Response> {
		return this.http.delete(
			`${this.classesUrl}/${c.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

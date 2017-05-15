import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Classroom } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class ClassroomService {
	private classroomsUrl = "http://localhost:8080/classrooms";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClassrooms(): Observable<Classroom[]> {
		return this.http.get(this.classroomsUrl)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getClassroom(id: number): Observable<Classroom> {
		return this.http.get(`${this.classroomsUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom
					: null);
	}

	getClassroomsByClass(classId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/classId/${classId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getClassroomsByBuilding(buildingId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/buildingId/${buildingId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getClassroomsByCapacity(capacity: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/capacity/${capacity}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getClassroomsByType(typeId: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/typeId/${typeId}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	getAvailableClassrooms(
		buildingId: number,
		typeId: number,
		day: number,
		num: number): Observable<Classroom[]> {
		return this.http.get(
			`${this.classroomsUrl}/available/buildingId/${buildingId}` +
			`/typeId/${typeId}/day/${day}/number/${num}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	addClassroom(classroom: Classroom): Observable<Response> {
		return this.http.post(
			this.classroomsUrl,
			JSON.stringify(classroom),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateClassroom(classroom: Classroom): Observable<Response> {
		return this.http.put(
			`${this.classroomsUrl}/${classroom.id}`,
			JSON.stringify(classroom),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteClassroom(classroom: Classroom): Observable<Response> {
		return this.http.delete(
			`${this.classroomsUrl}/${classroom.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

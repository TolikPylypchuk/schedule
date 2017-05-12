import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { Classroom } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class ClassroomService {
	private classroomsUrl = "http://localhost:8080/classrooms";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
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

	getClassroomsByType(type: number): Observable<Classroom[]> {
		return this.http.get(`${this.classroomsUrl}/type/${type}`)
			.map(response =>
				response.status === 200
					? response.json() as Classroom[]
					: null);
	}

	addClassroom(classroom: Classroom): Observable<Response> {
		return this.http.post(
			this.classroomsUrl,
			JSON.stringify(classroom),
			{ headers: this.headers })
			.catch(handleError);
	}

	updateClassroom(classroom: Classroom): Observable<Response> {
		return this.http.put(
			`${this.classroomsUrl}/${classroom.id}`,
			JSON.stringify(classroom),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteClassroom(classroom: Classroom): Observable<Response> {
		return this.http.delete(
			`${this.classroomsUrl}/${classroom.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}


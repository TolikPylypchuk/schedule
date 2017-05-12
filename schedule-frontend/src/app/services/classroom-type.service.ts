import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { ClassroomType } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class ClassroomTypeService {
	private classroomTypesUrl = "http://localhost:8080/classroomTypes";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
	}

	getClassroomTypes(): Observable<ClassroomType[]> {
		return this.http.get(this.classroomTypesUrl)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType[]
					: null);
	}

	getClassroomType(id: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	getClassroomTypeByClassroom(classroomId: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/classroomId/${classroomId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	getClassroomTypesBySubject(subjectId: number): Observable<ClassroomType> {
		return this.http.get(`${this.classroomTypesUrl}/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	addClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.post(
			this.classroomTypesUrl,
			JSON.stringify(classroomType),
			{ headers: this.headers })
			.catch(handleError);
	}

	updateClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.put(
			`${this.classroomTypesUrl}/${classroomType.id}`,
			JSON.stringify(classroomType),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.delete(
			`${this.classroomTypesUrl}/${classroomType.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}

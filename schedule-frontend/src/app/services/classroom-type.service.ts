import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { ClassroomType } from "../models/models";
import {handleError} from "./services";

@Injectable()
export class ClassroomTypeService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getClassroomTypes(): Observable<ClassroomType[]> {
		return this.http.get("api/classroomTypes")
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType[]
					: null);
	}

	getClassroomType(id: number): Observable<ClassroomType> {
		return this.http.get(`api/classroomTypes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	getClassroomTypeByClassroom(classroomId: number): Observable<ClassroomType> {
		return this.http.get(`api/classroomTypes/classroomId/${classroomId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	getClassroomTypesBySubject(subjectId: number): Observable<ClassroomType> {
		return this.http.get(`api/classroomTypes/subjectId/${subjectId}`)
			.map(response =>
				response.status === 200
					? response.json() as ClassroomType
					: null);
	}

	addClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.post(
			`api/classroomTypes/`,
			JSON.stringify(classroomType),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.put(
			`api/classroomTypes/${classroomType.id}`,
			JSON.stringify(classroomType),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteClassroomType(classroomType: ClassroomType): Observable<Response> {
		return this.http.delete(`api/classroomTypes/${classroomType.id}`)
			.catch(handleError);
	}
}

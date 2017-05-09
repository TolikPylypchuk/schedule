import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Wish } from "../models/models";
import { handleError } from "./services";

const prefix = "http://localhost:8080";

@Injectable()
export class WishService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getWishes(): Observable<Wish[]> {
		return this.http.get(`${prefix}/wishes`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	getWish(id: number): Observable<Wish> {
		return this.http.get(`${prefix}/wishes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish
					: null);
	}

	getWishesByLecturer(lecturerId: number): Observable<Wish[]> {
		return this.http.get(`${prefix}/wishes/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	getWishesByLecturerAndYearAndSemester(
		lecturerId: number, year: number, semester: number): Observable<Wish[]> {
		return this.http.get(
			`${prefix}/wishes/lecturerId/${lecturerId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	addWish(wish: Wish): Observable<Response> {
		return this.http.post(
			`${prefix}/wishes/`,
			JSON.stringify(wish),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	updateWish(wish: Wish): Observable<Response> {
		return this.http.put(
			`${prefix}/wishes/${wish.id}`,
			JSON.stringify(wish),
			{
				headers: new Headers({ "Content-Type": "application/json" })
			})
			.catch(handleError);
	}

	deleteWish(wish: Wish): Observable<Response> {
		return this.http.delete(`${prefix}/wishes/${wish.id}`)
			.catch(handleError);
	}
}


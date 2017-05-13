import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Wish } from "../models/models";
import { handleError, getHeaders } from "../functions";

@Injectable()
export class WishService {
	private wishesUrl = "http://localhost:8080/wishes";

	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getWishes(): Observable<Wish[]> {
		return this.http.get(this.wishesUrl)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	getWish(id: number): Observable<Wish> {
		return this.http.get(`${this.wishesUrl}/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish
					: null);
	}

	getWishesByLecturer(lecturerId: number): Observable<Wish[]> {
		return this.http.get(`${this.wishesUrl}/lecturerId/${lecturerId}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	getWishesByLecturerAndYearAndSemester(
		lecturerId: number, year: number, semester: number): Observable<Wish[]> {
		return this.http.get(
			`${this.wishesUrl}/lecturerId/${lecturerId}/year/${year}/semester/${semester}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	addWish(wish: Wish): Observable<Response> {
		return this.http.post(
			this.wishesUrl,
			JSON.stringify(wish),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	updateWish(wish: Wish): Observable<Response> {
		return this.http.put(
			`${this.wishesUrl}/${wish.id}`,
			JSON.stringify(wish),
			{ headers: getHeaders() })
			.catch(handleError);
	}

	deleteWish(wish: Wish): Observable<Response> {
		return this.http.delete(
			`${this.wishesUrl}/${wish.id}`,
			{ headers: getHeaders() })
			.catch(handleError);
	}
}

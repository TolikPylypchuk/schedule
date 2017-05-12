import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AuthService } from "../auth/auth.service";

import { Wish } from "../models/models";
import { handleError } from "./services";

@Injectable()
export class WishService {
	private wishesUrl = "http://localhost:8080/wishes";
	private headers;

	private http: Http;

	constructor(http: Http, authService: AuthService) {
		this.http = http;
		this.headers = authService.getHeaders();
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
			{ headers: this.headers })
			.catch(handleError);
	}

	updateWish(wish: Wish): Observable<Response> {
		return this.http.put(
			`${this.wishesUrl}/${wish.id}`,
			JSON.stringify(wish),
			{ headers: this.headers })
			.catch(handleError);
	}

	deleteWish(wish: Wish): Observable<Response> {
		return this.http.delete(
			`${this.wishesUrl}/${wish.id}`,
			{ headers: this.headers })
			.catch(handleError);
	}
}


import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { Wish } from "../models/models";

@Injectable()
export class WishService {
	private http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	getWishes(): Observable<Wish[]> {
		return this.http.get("api/wishes")
			.map(response =>
				response.status === 200
					? response.json() as Wish[]
					: null);
	}

	getWish(id: number): Observable<Wish> {
		return this.http.get(`api/wishes/${id}`)
			.map(response =>
				response.status === 200
					? response.json() as Wish
					: null);
	}
}


import { Injectable } from "@angular/core";
import { Http, Headers, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { User } from "../models/models";
import { handleError } from "../services/services";

declare const localStorage;

@Injectable()
export class AuthService {
	private authUrl = "http://localhost:8080/auth";
	private currentUserUrl = "http://localhost:8080/users/current";
	private headers: Headers;

	private http: Http;

	private currentUserSource = new BehaviorSubject<User>(null);
	private loggedIn = false;
	private returnUrl: string = null;

	constructor(http: Http) {
		this.http = http;
		this.headers = this.getHeaders();
	}

	getCurrentUser(): User {
		return this.currentUserSource.getValue();
	}

	getCurrentUserAsObservable(): Observable<User> {
		return this.currentUserSource.asObservable();
	}

	getReturnUrl(): string {
		return this.returnUrl;
	}

	setReturnUrl(returnUrl: string): void {
		this.returnUrl = returnUrl;
	}

	login(username: string, password: string): Observable<boolean> {
		return this.http.post(
			this.authUrl,
			JSON.stringify({ username: username, password: password }),
			{ headers: this.headers })
			.map((response: Response) => {
				const token = response.json() && response.json().token;

				if (token) {
					localStorage.setItem("authToken", token);
					this.loggedIn = true;

					this.http.get(this.currentUserUrl)
						.map(response =>
							response.status === 200
								? response.json() as User
								: null)
						.subscribe((user: User) =>
							this.currentUserSource.next(user));

					return true;
				}

				return false;
			})
			.catch(handleError);
	}

	logout(): void {
		localStorage.removeItem("authToken");
		this.currentUserSource.next(null);
		this.loggedIn = false;
	}

	isLoggedIn(): boolean {
		return this.loggedIn;
	}

	getToken(): string {
		const token = JSON.parse(localStorage.getItem("authToken"));
		return token ? token : null;
	}

	getHeaders(): Headers {
		return this.isLoggedIn()
			? new Headers({
				"Content-Type": "application/json",
				"Authentication": `Bearer ${this.getToken()}`
			})
			: new Headers({ "Content-Type": "application/json" });
	}
}

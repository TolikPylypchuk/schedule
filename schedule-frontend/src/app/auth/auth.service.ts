import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { User } from "../models/models";
import { handleError } from "../common/functions";

declare const localStorage;

@Injectable()
export class AuthService {
	private authUrl = "http://localhost:8080/auth";
	private currentUserUrl = "http://localhost:8080/users/current";

	private http: Http;
	private router: Router;

	private currentUserSource = new BehaviorSubject<User>({
		id: 16,
		firstName: "Анастасія",
		middleName: "Василівна",
		lastName: "Коломоєць",
		position: null,
		faculty: {
			"id": 1,
			"name": "Факультет прикладної математики та інформатики"
		},
		authorities: [
			{
				"id": 2,
				"name": "ROLE_EDITOR"
			}
		]
	});

	private loggedIn = true;
	private returnUrl: string = null;

	constructor(http: Http, router: Router) {
		this.http = http;
		this.router = router
	}

	getCurrentUser(): Observable<User> {
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
			{ headers: this.getHeaders() })
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
						.subscribe((user: User) => {
							this.currentUserSource.next(user);
							this.router.navigate([ this.getReturnUrl() ]);
							this.setReturnUrl("");
						});

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
		return true; //this.loggedIn;
	}

	getToken(): string {
		/*
		const token = JSON.parse(localStorage.getItem("authToken"));
		return token ? token : null;
		*/
		return "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb2xvbW9ldHMuYW5hc3Rhc2lhIiwiYXVkaWVuY2UiOiJ3ZWIiLCJjcmVhdGVkIjoxNDk0NjYxNzAyMTA3LCJleHAiOjE0OTUyNjY1MDJ9.qJ1nAR5WU_hw_xc9NjzPQWTDWKJ-fNsS5EZCr9XPmR1w98KoVuhlK9Rbsd-d5KnmNr01EoW5GqyKiBxLeDAJjA";
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

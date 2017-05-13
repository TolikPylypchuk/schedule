import { Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

declare const localStorage;

export function getAuthToken(): string {
	/*
	 const token = JSON.parse(localStorage.getItem("authToken"));
	 return token ? token : null;
	 */
	return "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb2xvbW9ldHMuYW5hc3Rhc2lhIiwiYXVkaWVuY2UiOiJ3ZWIiLCJjcmVhdGVkIjoxNDk0NjYxNzAyMTA3LCJleHAiOjE0OTUyNjY1MDJ9.qJ1nAR5WU_hw_xc9NjzPQWTDWKJ-fNsS5EZCr9XPmR1w98KoVuhlK9Rbsd-d5KnmNr01EoW5GqyKiBxLeDAJjA";
}

export function getHeaders(): Headers {
	return getAuthToken()
		? new Headers({
			"Content-Type": "application/json",
			"Authentication": `Bearer ${this.getToken()}`
		})
		: new Headers({ "Content-Type": "application/json" });
}

export function handleError(error: Response | any): ErrorObservable {
	let message: string;

	if (error instanceof Response) {
		const body = error.json() || "";
		const err = body.error || JSON.stringify(body);
		message = `${error.status} - ${error.statusText || ""} ${err}`;
	} else {
		message = error.message ? error.message : error.toString();
	}

	console.error(message);

	return Observable.throw(message);
}

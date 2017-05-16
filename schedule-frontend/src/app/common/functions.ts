import { Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

declare const localStorage;

export function getAuthToken(): string {
	/*
	 const token = JSON.parse(localStorage.getItem("authToken"));
	 return token ? token : null;
	 */
	return "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrb2xvbW9ldHMuYW5hc3Rhc2lhIiwiYXVkaWVuY2UiOiJ3ZWIiLCJjcmVhdGVkIjoxNDk0OTI1NTQzMTQ2LCJleHAiOjE0OTU1MzAzNDN9.XEhp0s1mT5DRw3c5iFJCsI7qJBTAkxzT67bL574UWbJyamzVNipUBjpgbeSV5BuRmgBrYkSfeAoU_ZD5LjuGyQ";
}

export function getHeaders(): Headers {
	return getAuthToken()
		? new Headers({
			"Content-Type": "application/json",
			"Authorization": `Bearer ${getAuthToken()}`
		})
		: new Headers({
			"Content-Type": "application/json"
		});
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

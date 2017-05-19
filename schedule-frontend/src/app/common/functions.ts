import { Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/Observable/ErrorObservable";

declare const localStorage;

export function getAuthToken(): string {
	const token = JSON.parse(localStorage.getItem("scheduleAuthToken"));
	return token ? token : null;
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
		message = `${error.status} - ${err}`;
	} else {
		message = error.message ? error.message : error.toString();
	}

	console.error(message);

	return Observable.throw(message);
}

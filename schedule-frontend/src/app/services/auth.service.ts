import { Injectable } from "@angular/core";
import { Http, URLSearchParams  } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { handleError } from "./services";

declare let localStorage;

@Injectable()
export class AuthService {
	private clientId = "233668646673605";
	private clientSecret = "33b17e044ee6a4fa383f46ec6e28ea1d";

	http: Http;

	constructor(http: Http) {
		this.http = http;
	}

	login(username: string, password: string): Observable<any> {
		let params: URLSearchParams = new URLSearchParams();
		params.set("username", username);
		params.set("password", password);
		params.set("client_id", this.clientId);
		params.set("client_secret", this.clientSecret);
		params.set("grant_type", "password");

		return this.http.get("https://graph.facebook.com/oauth/access_token", { params: params })
			.map(response => response.json())
			.catch(handleError);
	}

	public logout() {
		localStorage.removeItem('token');
	}
}



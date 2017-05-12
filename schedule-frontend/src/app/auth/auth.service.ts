import { Injectable } from "@angular/core";

import { User } from "../models/models";

@Injectable()
export class AuthService {
	getCurrentUser(): User {
		return {
			id: 1,
			firstName: "Адмін",
			middleName: "Адмінович",
			lastName: "Адмін",
			position: null,
			faculty: {
				id: 1,
				name: "Факультет прикладної математики та інформатики"
			}
		}
	}
}

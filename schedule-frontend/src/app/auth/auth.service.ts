import { Injectable } from "@angular/core";
import {Headers} from '@angular/http';
import { User } from '../models/models';

@Injectable()
export class AuthService {
	private api = 'http://localhost:8080';
	private headers = new Headers({ 'Content-Type': 'application/json' });

	getCurrentUser(): User {
		return {
			id: 1,
			firstName: 'Адмін',
			middleName: 'Адмінович',
			lastName: 'Адмін',
			position: null,
			faculty: {
				id: 1,
				name: 'Факультет прикладної математики та інформатики'
			},
			authorities: [
				{
					id: 1,
					name: 'ROLE_ADMIN'
				}
			]
		}
	}
}

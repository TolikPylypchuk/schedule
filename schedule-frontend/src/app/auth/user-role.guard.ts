import  { Injectable } from "@angular/core";
import {
	CanActivate, ActivatedRouteSnapshot,
	Router, RouterStateSnapshot
} from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class UserRoleGuard implements CanActivate {
	private router: Router;
	private authService: AuthService;

	constructor(router: Router, authService: AuthService) {
		this.router = router;
		this.authService = authService;
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean {
		if (!this.authService.isLoggedIn) {
			return true;
		}

		const user = this.authService.getCurrentUser();

		const navigateUrl = user.authorities.find(r => r.name === "ROLE_ADMIN")
			? "/admin"
			: user.authorities.find(r => r.name === "ROLE_EDITOR")
				? "/editor"
				: user.authorities.find(r => r.name === "ROLE_LECTURER")
					? "/lecturer"
					: null;

		this.router.navigate([ navigateUrl ]);

		return false;
	}
}

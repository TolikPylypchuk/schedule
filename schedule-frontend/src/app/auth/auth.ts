import { LoginComponent } from "./login.component";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./auth.guard";
import { UserRoleGuard } from "./user-role.guard";

import { AuthModule } from "./auth.module";
import { RoutesModule } from "./routes.module";

export {
	AuthModule,
	RoutesModule,

	LoginComponent,

	AuthService,

	AuthGuard,
	UserRoleGuard
}

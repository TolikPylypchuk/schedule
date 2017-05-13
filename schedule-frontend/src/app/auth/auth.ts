import { LoginComponent } from "./login.component";

import { AuthService } from "./auth.service";

import { AuthGuard } from "./auth.guard";
import { LecturerGuard } from "./lecturer.guard";
import { EditorGuard } from "./editor.guard";
import { AdminGuard } from "./admin.guard";
import { UserRoleGuard } from "./user-role.guard";

import { AuthModule } from "./auth.module";
import { RoutesModule } from "./routes.module";

export {
	AuthModule,
	RoutesModule,

	LoginComponent,

	AuthService,

	AuthGuard,
	LecturerGuard,
	EditorGuard,
	AdminGuard,
	UserRoleGuard
}

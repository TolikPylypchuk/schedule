import { AuthModule } from "./auth.module";
import { RoutesModule } from "./routes.module";

import { LoginComponent } from "./components/login.component";

import { AuthService } from "./services/auth.service";

import { AuthGuard } from "./guards/auth.guard";
import { LecturerGuard } from "./guards/lecturer.guard";
import { EditorGuard } from "./guards/editor.guard";
import { AdminGuard } from "./guards/admin.guard";
import { UserRoleGuard } from "./guards/user-role.guard";

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

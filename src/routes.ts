/**
 * All application routes.
 */

//
import { app } from "./index";
import { RatingRouter } from "./routes/rating.router";
import { AuthRouter } from "./routes/auth.router";
import { UserRouter } from "./routes/user.router";
import { ClassificationRouter } from "./routes/classification.router";
import { CompanyRouter } from "./routes/company.router";
import { FavoriteRouter } from "./routes/favorite.router";
import { GameRouter } from "./routes/game.router";
import { GameCompanyRouter } from "./routes/game-company.router";
import { GameGenreRouter } from "./routes/game-genre.router";
import { GamePlatformRouter } from "./routes/game-platform.router";
import { GenreRouter } from "./routes/genre.router";
import { PermissionRouter } from "./routes/permission.router";
import { PlatformRouter } from "./routes/platform.router";


export class Routes
{
	public static initializeRoutes(): void
	{
		app.use("/api/", AuthRouter.initializeRoutes());
		app.use("/api/", UserRouter.initializeRoutes());
		app.use("/api/", ClassificationRouter.initializeRoutes());
		app.use("/api/", CompanyRouter.initializeRoutes());
		app.use("/api/", FavoriteRouter.initializeRoutes());
		app.use("/api/", GameRouter.initializeRoutes());
		app.use("/api/", GameCompanyRouter.initializeRoutes());
		app.use("/api/", GameGenreRouter.initializeRoutes());
		app.use("/api/", GamePlatformRouter.initializeRoutes());
		app.use("/api/", GenreRouter.initializeRoutes());
		app.use("/api/", PermissionRouter.initializeRoutes());
		app.use("/api/", PlatformRouter.initializeRoutes());
		app.use("/api/", RatingRouter.initializeRoutes());
	}
}

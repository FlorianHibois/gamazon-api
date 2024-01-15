// Imports dependencies
import { UserController } from "../controllers/user.controller";
import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { RateLimit } from "../middlewares/rate-limit";
import { final } from "../decorators/final";
import { Multer } from "../middlewares/multer";
import { Sharp } from "../middlewares/sharp";

@final
export class UserRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const userController: UserController = new UserController();
		UserRouter.router.post("/user", RateLimit.signUpLimiter, Multer.upload, Sharp.checkFile, userController.create);
		UserRouter.router.get("/user", AuthenticationMiddleware.auth, userController.getAll);
		UserRouter.router.get("/user/:id", AuthenticationMiddleware.auth, userController.getOne);
		UserRouter.router.patch("/user/:id", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, userController.update);
		UserRouter.router.delete("/user/:id", AuthenticationMiddleware.auth, userController.delete);
		return UserRouter.router;
	}
}

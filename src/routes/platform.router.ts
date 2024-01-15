import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { PlatformController } from "../controllers/platform.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { Multer } from "../middlewares/multer";
import { Sharp } from "../middlewares/sharp";

export class PlatformRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const platformController: PlatformController = new PlatformController();
		this.router.post("/platform", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, platformController.create);
		this.router.get("/platform", AuthenticationMiddleware.auth, platformController.getAll);
		this.router.get("/platform/:id", AuthenticationMiddleware.auth, platformController.getOne);
		this.router.patch("/platform/:id", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, platformController.update);
		this.router.delete("/platform/:id", AuthenticationMiddleware.auth, platformController.delete);
		return PlatformRouter.router;
	}
}

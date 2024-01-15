import { AbstractRouter } from "./abstract.router";
import { ClassificationController } from "../controllers/classification.controller";
import { Router } from "express";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { Multer } from "../middlewares/multer";
import { Sharp } from "../middlewares/sharp";

export class ClassificationRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const classificationController: ClassificationController = new ClassificationController();
		this.router.post("/classification", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, classificationController.create);
		this.router.get("/classification", AuthenticationMiddleware.auth, classificationController.getAll);
		this.router.get("/classification/:id", AuthenticationMiddleware.auth, classificationController.getOne);
		this.router.patch("/classification/:id", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, classificationController.update);
		this.router.delete("/classification/:id", AuthenticationMiddleware.auth, classificationController.delete);
		return ClassificationRouter.router;
	}
}

import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { RatingController } from "../controllers/rating.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { final } from "../decorators/final";

@final
export class RatingRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const ratingController: RatingController = new RatingController();
		this.router.post("/rating", AuthenticationMiddleware.auth, ratingController.create);
		this.router.get("/rating", AuthenticationMiddleware.auth, ratingController.getAll);
		this.router.get("/rating/:id", AuthenticationMiddleware.auth, ratingController.getOne);
		this.router.patch("/rating/:id", AuthenticationMiddleware.auth, ratingController.update);
		this.router.delete("/rating/:id", AuthenticationMiddleware.auth, ratingController.delete);
		return RatingRouter.router;
	}
}

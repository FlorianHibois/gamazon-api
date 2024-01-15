import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { FavoriteController } from "../controllers/favorite.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";

export class FavoriteRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const favoriteController: FavoriteController = new FavoriteController();
		this.router.post("/favorite", AuthenticationMiddleware.auth, favoriteController.create);
		this.router.get("/favorite", AuthenticationMiddleware.auth, favoriteController.getAll);
		this.router.get("/favorite/:id", AuthenticationMiddleware.auth, favoriteController.getOne);
		this.router.patch("/favorite/:id", AuthenticationMiddleware.auth, favoriteController.update);
		this.router.delete("/favorite/:id", AuthenticationMiddleware.auth, favoriteController.delete);
		return FavoriteRouter.router;
	}
}

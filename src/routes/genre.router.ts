import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";

export class GenreRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const genreController: GenreController = new GenreController();
		this.router.post("/genre", AuthenticationMiddleware.auth, genreController.create);
		this.router.get("/genre", AuthenticationMiddleware.auth, genreController.getAll);
		this.router.get("/genre/:id", AuthenticationMiddleware.auth, genreController.getOne);
		this.router.patch("/genre/:id", AuthenticationMiddleware.auth, genreController.update);
		this.router.delete("/genre/:id", AuthenticationMiddleware.auth, genreController.delete);
		return GenreRouter.router;
	}
}

import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { GameGenreController } from "../controllers/game-genre.controller";

export class GameGenreRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const gameGenreController: GameGenreController = new GameGenreController();
		this.router.post("/game-genre", AuthenticationMiddleware.auth, gameGenreController.create);
		this.router.get("/game-genre", AuthenticationMiddleware.auth, gameGenreController.getAll);
		this.router.get("/game-genre/:id", AuthenticationMiddleware.auth, gameGenreController.getOne);
		this.router.patch("/game-genre/:id", AuthenticationMiddleware.auth, gameGenreController.update);
		this.router.delete("/game-genre/:id", AuthenticationMiddleware.auth, gameGenreController.delete);
		return GameGenreRouter.router;
	}
}

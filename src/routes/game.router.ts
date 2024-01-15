import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { GameController } from "../controllers/game.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { Multer } from "../middlewares/multer";
import { Sharp } from "../middlewares/sharp";

export class GameRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const gameController: GameController = new GameController();
		this.router.post("/game", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, gameController.create);
		this.router.get("/game", AuthenticationMiddleware.auth, gameController.getAll);
		this.router.get("/game/:id", AuthenticationMiddleware.auth, gameController.getOne);
		this.router.patch("/game/:id", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, gameController.update);
		this.router.delete("/game/:id", AuthenticationMiddleware.auth, gameController.delete);
		return GameRouter.router;
	}
}

import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { GamePlatformController } from "../controllers/game-platform.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";

export class GamePlatformRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const gamePlatformController: GamePlatformController = new GamePlatformController();
		this.router.post("/game-platform", AuthenticationMiddleware.auth, gamePlatformController.create);
		this.router.get("/game-platform", AuthenticationMiddleware.auth, gamePlatformController.getAll);
		this.router.get("/game-platform/:id", AuthenticationMiddleware.auth, gamePlatformController.getOne);
		this.router.patch("/game-platform/:id", AuthenticationMiddleware.auth, gamePlatformController.update);
		this.router.delete("/game-platform/:id", AuthenticationMiddleware.auth, gamePlatformController.delete);
		return GamePlatformRouter.router;
	}
}

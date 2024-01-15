import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { GameCompanyController } from "../controllers/game-company.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";

export class GameCompanyRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const gameCompanyController: GameCompanyController = new GameCompanyController();
		this.router.post("/game-company", AuthenticationMiddleware.auth, gameCompanyController.create);
		this.router.get("/game-company", AuthenticationMiddleware.auth, gameCompanyController.getAll);
		this.router.get("/game-company/:id", AuthenticationMiddleware.auth, gameCompanyController.getOne);
		this.router.patch("/game-company/:id", AuthenticationMiddleware.auth, gameCompanyController.update);
		this.router.delete("/game-company/:id", AuthenticationMiddleware.auth, gameCompanyController.delete);
		return GameCompanyRouter.router;
	}
}

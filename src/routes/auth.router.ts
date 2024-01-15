// Imports dependencies
import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { AbstractRouter } from "./abstract.router";
import { RateLimit } from "../middlewares/rate-limit";

export class AuthRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		this.router.post("/login", RateLimit.loginLimiter, AuthService.login);
		this.router.post("/logout", AuthService.logout);
		return AuthRouter.getRoutes();
	}

	private static getRoutes(): Router
	{
		return AuthRouter.router;
	}

}

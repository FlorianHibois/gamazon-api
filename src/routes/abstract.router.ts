import express, { Router } from "express";

export abstract class AbstractRouter
{
	// Creation of a new router
	protected static router: Router = express.Router();

	public static initializeRoutes(): void
	{
	};
}

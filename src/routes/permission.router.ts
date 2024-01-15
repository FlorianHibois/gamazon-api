import { AbstractRouter } from "./abstract.router";
import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { AuthenticationMiddleware } from "../middlewares/auth";

export class PermissionRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const permissionController: PermissionController = new PermissionController();
		this.router.post("/permission", AuthenticationMiddleware.auth, permissionController.create);
		this.router.get("/permission", AuthenticationMiddleware.auth, permissionController.getAll);
		this.router.get("/permission/:id", AuthenticationMiddleware.auth, permissionController.getOne);
		this.router.patch("/permission/:id", AuthenticationMiddleware.auth, permissionController.update);
		this.router.delete("/permission/:id", AuthenticationMiddleware.auth, permissionController.delete);
		return PermissionRouter.router;
	}
}

import { AbstractRouter } from "./abstract.router";
import { CompanyController } from "../controllers/company.controller";
import { Router } from "express";
import { AuthenticationMiddleware } from "../middlewares/auth";
import { Multer } from "../middlewares/multer";
import { Sharp } from "../middlewares/sharp";

export class CompanyRouter extends AbstractRouter
{
	public static override initializeRoutes(): Router
	{
		const companyController: CompanyController = new CompanyController();
		this.router.post("/company", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, companyController.create);
		this.router.get("/company", AuthenticationMiddleware.auth, companyController.getAll);
		this.router.get("/company/:id", AuthenticationMiddleware.auth, companyController.getOne);
		this.router.patch("/company/:id", AuthenticationMiddleware.auth, Multer.upload, Sharp.checkFile, companyController.update);
		this.router.delete("/company/:id", AuthenticationMiddleware.auth, companyController.delete);
		return CompanyRouter.router;
	}

}

import { Request, Response } from "express";

export abstract class AbstractController
{
	abstract create(req: Request, res: Response): Promise<any>;

	abstract getAll(req: Request, res: Response): Promise<any>;

	abstract getOne(req: Request, res: Response): Promise<any>;

	abstract update(req: Request, res: Response): Promise<any>;

	abstract delete(req: Request, res: Response): Promise<any>;

}


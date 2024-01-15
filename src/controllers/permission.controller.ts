import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { Repository } from "typeorm";
import { Permission } from "../models/permission";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class PermissionController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Permission).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const permission: Permission | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Permission).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (permission !== null)
		{
			return res.status(SuccessCode.OK).json(permission);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Permission).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const permissionRepo: Repository<Permission> = DataSourceInformation.mysqlDataSource.getRepository(Permission);
		const permission: Permission | null          = req.params.id ? await permissionRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (permission)
		{
			if (req.body.description && !StringManipulator.isEmpty(req.body.description))
			{
				permission.description      = req.body.description;
				permission.modificationDate = new Date();

				if (req.body.active)
				{
					permission.active = req.body.active;
				}

				return res.status(SuccessCode.OK).json(await permissionRepo.save(permission));
			}
			else
			{
				return res
				.status(ClientCode.BAD_REQUEST)
				.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not updated because the description is missing or empty. Please make that a description is filled and try again.` });
			}
		}
		else
		{
			return res
			.status(ClientCode.NOT_FOUND)
			.json({ message: `Can't update the ${ StringManipulator.extractFileName(__filename) }. It was not found. Please make sure you chose an existing one.` });
		}
	}

	public async create(req: Request, res: Response): Promise<any>
	{
		if (req.body.description && !StringManipulator.isEmpty(req.body.description))
		{
			const newPermission: Permission = new Permission();
			newPermission.description       = req.body.description;
			newPermission.creationDate      = new Date();
			newPermission.modificationDate  = new Date();
			newPermission.active            = true;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Permission).insert(newPermission);
				return res.status(SuccessCode.OK).json(newPermission);
			}
			catch (err: any)
			{
				return res.status(ServerCode.INTERNAL_SERVER_ERROR).json({ message: `Something unexpected went wrong. Please contact the support and provide them this following error message: ${ err.message }.` });
			}
		}
		else
		{
			return res
			.status(ClientCode.BAD_REQUEST)
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the description is missing or empty. Please make sure that a description is filled and try again.` });
		}
	}
}

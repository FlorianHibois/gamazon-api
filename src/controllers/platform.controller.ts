import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { Platform } from "../models/platform";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";
import fs from "fs";

@final
export class PlatformController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Platform).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const platform: Platform | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Platform).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (platform !== null)
		{
			return res.status(SuccessCode.OK).json(platform);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Platform).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const platformRepo: Repository<Platform> = DataSourceInformation.mysqlDataSource.getRepository(Platform);
		const platform: Platform | null          = req.params.id ? await platformRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (platform)
		{
			if (req.body.name && !StringManipulator.isEmpty(req.body.name))
			{
				const imageUrl: string | null = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
				platform.name                 = req.body.name;
				platform.modificationDate     = new Date();

				if (req.body.active)
				{
					platform.active = req.body.active;
				}

				if (imageUrl !== platform.image)
				{
					if (!imageUrl && platform.image)
					{
						let fileName: string = platform.image.split(`${ req.protocol }://${ req.get("host") }/images/`).join("");
						fs.unlink(`src/images/${ fileName }`, (): void =>
						{
							console.log(`Image successfully deleted.`);
						});
					}
					platform.image = imageUrl;
				}

				return res.status(SuccessCode.OK).json(await platformRepo.save(platform));
			}
			else
			{
				return res
				.status(ClientCode.BAD_REQUEST)
				.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not updated because the name is missing or empty. Please make sure that a name is filled and try again.` });
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
		if (req.body.name && !StringManipulator.isEmpty(req.body.name))
		{
			const imageUrl: string | null = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
			const newPlatform: Platform   = new Platform();
			newPlatform.name              = req.body.name;
			newPlatform.creationDate      = new Date();
			newPlatform.modificationDate  = new Date();
			newPlatform.active            = true;

			if (imageUrl)
			{
				newPlatform.image = imageUrl;
			}

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Platform).insert(newPlatform);
				return res.status(SuccessCode.OK).json(newPlatform);
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
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the name is missing or empty. Please make sure that a name is filled and try again.` });
		}
	}
}

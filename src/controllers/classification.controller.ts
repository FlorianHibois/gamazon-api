import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { Classification } from "../models/classification";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";
import fs from "fs";

@final
export class ClassificationController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Classification).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const classification: Classification | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Classification).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (classification !== null)
		{
			return res.status(SuccessCode.OK).json(classification);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Classification).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const classificationRepo: Repository<Classification> = DataSourceInformation.mysqlDataSource.getRepository(Classification);
		const classification: Classification | null          = req.params.id ? await classificationRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (classification)
		{
			if (req.body.name && !StringManipulator.isEmpty(req.body.name))
			{
				const imageUrl: string | null   = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
				classification.name             = req.body.name;
				classification.modificationDate = new Date();

				if (req.body.active)
				{
					classification.active = req.body.active;
				}

				if (imageUrl !== classification.image)
				{
					if (!imageUrl && classification.image)
					{
						let fileName: string = classification.image.split(`${ req.protocol }://${ req.get("host") }/images/`).join("");
						fs.unlink(`src/images/${ fileName }`, (): void =>
						{
							console.log(`Image successfully deleted.`);
						});
					}
					classification.image = imageUrl;
				}

				return res.status(SuccessCode.OK).json(await classificationRepo.save(classification));
			}
			else
			{
				return res
				.status(ClientCode.BAD_REQUEST)
				.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not updated because the name is missing or empty. Please make that a name is filled and try again.` });
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
			const imageUrl: string | null           = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
			const newClassification: Classification = new Classification();
			newClassification.name                  = req.body.name;
			newClassification.creationDate          = new Date();
			newClassification.modificationDate      = new Date();
			newClassification.active                = true;

			if (imageUrl)
			{
				newClassification.image = imageUrl;
			}
			
			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Classification).insert(newClassification);
				return res.status(SuccessCode.OK).json(newClassification);
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

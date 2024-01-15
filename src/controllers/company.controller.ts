import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { Company } from "../models/company";
import { StringManipulator } from "../utils/string-manipulator";
import fs from "fs";

export class CompanyController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Company).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const company: Company | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Company).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (company !== null)
		{
			return res.status(SuccessCode.OK).json(company);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Company).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const companyRepo: Repository<Company> = DataSourceInformation.mysqlDataSource.getRepository(Company);
		const company: Company | null          = req.params.id ? await companyRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (company)
		{
			if (req.body.name && !StringManipulator.isEmpty(req.body.name))
			{
				const imageUrl: string | null = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
				company.name                  = req.body.name;
				company.modificationDate      = new Date();

				if (req.body.active)
				{

					company.active = req.body.active;
				}

				if (req.body.companyCreationDate)
				{
					company.companyCreationDate = new Date(req.body.companyCreationDate);
				}

				if (imageUrl !== company.image)
				{
					if (!imageUrl && company.image)
					{
						let fileName: string = company.image.split(`${ req.protocol }://${ req.get("host") }/images/`).join("");
						fs.unlink(`src/images/${ fileName }`, (): void =>
						{
							console.log(`Image successfully deleted.`);
						});
					}
					company.image = imageUrl;
				}

				return res.status(SuccessCode.OK).json(await companyRepo.save(company));
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
			const newCompany: Company     = new Company();
			newCompany.name               = req.body.name;

			if (req.body.companyCreationDate)
			{
				newCompany.companyCreationDate = new Date(req.body.companyCreationDate);
			}

			if (imageUrl)
			{
				newCompany.image = imageUrl;
			}

			newCompany.creationDate     = new Date();
			newCompany.modificationDate = new Date();
			newCompany.active           = true;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Company).insert(newCompany);
				return res.status(SuccessCode.OK).json(newCompany);
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

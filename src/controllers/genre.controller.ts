import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { Repository } from "typeorm";
import { Genre } from "../models/genre";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class GenreController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Genre).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const genre: Genre | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Genre).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (genre !== null)
		{
			return res.status(SuccessCode.OK).json(genre);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Genre).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const genreRepo: Repository<Genre> = DataSourceInformation.mysqlDataSource.getRepository(Genre);
		const genre: Genre | null          = req.params.id ? await genreRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (genre)
		{
			if (req.body.name && !StringManipulator.isEmpty(req.body.name))
			{
				genre.name             = req.body.name;
				genre.modificationDate = new Date();

				if (req.body.active)
				{
					genre.active = req.body.active;
				}

				return res.status(SuccessCode.OK).json(await genreRepo.save(genre));
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
		const newGenre: Genre = new Genre();
		if (req.body.name && !StringManipulator.isEmpty(req.body.name))
		{
			newGenre.name             = req.body.name;
			newGenre.creationDate     = new Date();
			newGenre.modificationDate = new Date();
			newGenre.active           = true;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Genre).insert(newGenre);
				return res.status(SuccessCode.OK).json(newGenre);
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
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the name is missing or empty. Please make that a name is filled and try again.` });
		}
	}
}

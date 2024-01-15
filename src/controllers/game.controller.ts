import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { Game } from "../models/game";
import { Classification } from "../models/classification";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";
import * as fs from "fs";

@final
export class GameController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Game).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const game: Game | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (game !== null)
		{
			return res.status(SuccessCode.OK).json(game);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Game).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const gameRepo: Repository<Game> = DataSourceInformation.mysqlDataSource.getRepository(Game);
		const game: Game | null          = req.params.id ? await gameRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (game)
		{
			const imageUrl: string | null               = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
			const classification: Classification | null = req.body.id_classification ? await DataSourceInformation.mysqlDataSource.getRepository(Classification).findOneBy({ id: parseInt(req.body.id_classification, 10) }) : null;
			const gamePrequel: Game | null              = req.body.id_prequel ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_prequel, 10) }) : null;
			const gameSequel: Game | null               = req.body.id_sequel ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_sequel, 10) }) : null;
			game.modificationDate                       = new Date();
			game.classification                         = classification;
			game.gamePrequel                            = gamePrequel;
			game.gameSequel                             = gameSequel;

			if (req.body.active)
			{
				game.active = req.body.active;
			}

			if (imageUrl !== game.image)
			{
				if (!imageUrl && game.image)
				{
					let fileName: string = game.image.split(`${ req.protocol }://${ req.get("host") }/images/`).join("");
					fs.unlink(`src/images/${ fileName }`, (): void =>
					{
						console.log(`Image successfully deleted.`);
					});
				}
				game.image = imageUrl;
			}

			return res.status(SuccessCode.OK).json(await gameRepo.save(game));
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
			const imageUrl: string | null               = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
			const classification: Classification | null = req.body.id_classification ? await DataSourceInformation.mysqlDataSource.getRepository(Classification).findOneBy({ id: parseInt(req.body.id_classification, 10) }) : null;
			const gameRepo: Repository<Game>            = DataSourceInformation.mysqlDataSource.getRepository(Game);
			const gamePrequel: Game | null              = req.body.id_prequel ? await gameRepo.findOneBy({ id: parseInt(req.body.id_prequel, 10) }) : null;
			const gameSequel: Game | null               = req.body.id_sequel ? await gameRepo.findOneBy({ id: parseInt(req.body.id_sequel, 10) }) : null;
			const newGame: Game                         = new Game();
			newGame.creationDate                        = new Date();
			newGame.modificationDate                    = new Date();
			newGame.active                              = true;
			newGame.name                                = req.body.name;
			newGame.classification                      = classification;
			newGame.gamePrequel                         = gamePrequel;
			newGame.gameSequel                          = gameSequel;

			if (req.body.releaseDate)
			{
				newGame.releaseDate = new Date(req.body.releaseDate);
			}

			if (imageUrl)
			{
				newGame.image = imageUrl;
			}

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Game).insert(newGame);
				return res.status(SuccessCode.OK).json(newGame);
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

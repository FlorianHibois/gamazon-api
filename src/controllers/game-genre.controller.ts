import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { StringManipulator } from "../utils/string-manipulator";
import { Repository } from "typeorm";
import { Game } from "../models/game";
import { GameGenre } from "../models/game-genre";
import { Genre } from "../models/genre";

export class GameGenreController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GameGenre).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const gameGenre: GameGenre | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(GameGenre).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gameGenre !== null)
		{
			return res.status(SuccessCode.OK).json(gameGenre);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GameGenre).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const gameGenreRepo: Repository<GameGenre> = DataSourceInformation.mysqlDataSource.getRepository(GameGenre);
		const gameGenre: GameGenre | null          = req.params.id ? await gameGenreRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gameGenre)
		{
			const genre: Genre | null  = req.body.id_genre ? await DataSourceInformation.mysqlDataSource.getRepository(Genre).findOneBy({ id: parseInt(req.body.id_genre, 10) }) : null;
			const game: Game | null    = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
			gameGenre.modificationDate = new Date();
			gameGenre.active           = req.body.active;
			gameGenre.game             = game;
			gameGenre.genre            = genre;

			return res.status(SuccessCode.OK).json(await gameGenreRepo.save(gameGenre));
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
		const genre: Genre | null = req.body.id_genre ? await DataSourceInformation.mysqlDataSource.getRepository(Genre).findOneBy({ id: parseInt(req.body.id_genre, 10) }) : null;
		const game: Game | null   = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
		if (genre && game)
		{
			const newGameGenre: GameGenre = new GameGenre();
			newGameGenre.creationDate     = new Date();
			newGameGenre.modificationDate = new Date();
			newGameGenre.active           = true;
			newGameGenre.genre            = genre;
			newGameGenre.game             = game;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(GameGenre).insert(newGameGenre);
				return res.status(SuccessCode.OK).json(newGameGenre);
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
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the genre and game are missing. Please make sure that there are a game and genre and try again.` });
		}
	}
}

import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { Favorite } from "../models/favorite";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { User } from "../models/user";
import { Game } from "../models/game";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class FavoriteController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Favorite).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const favorite: Favorite | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Favorite).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (favorite !== null)
		{
			return res.status(SuccessCode.OK).json(favorite);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Favorite).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const favoriteRepo: Repository<Favorite> = DataSourceInformation.mysqlDataSource.getRepository(Favorite);
		const favorite: Favorite | null          = req.params.id ? await favoriteRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (favorite)
		{
			const user: User | null   = req.body.id_user ? await DataSourceInformation.mysqlDataSource.getRepository(User).findOneBy({ id: parseInt(req.body.id_user, 10) }) : null;
			const game: Game | null   = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
			favorite.user             = user;
			favorite.game             = game;
			favorite.modificationDate = new Date();

			if (req.body.active)
			{
				favorite.active = req.body.active;
			}

			return res.status(SuccessCode.OK).json(await favoriteRepo.save(favorite));
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
		const user: User | null = req.body.id_user ? await DataSourceInformation.mysqlDataSource.getRepository(User).findOneBy({ id: parseInt(req.body.id_user, 10) }) : null;
		const game: Game | null = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
		if (user && game)
		{
			const newFavorite: Favorite  = new Favorite();
			newFavorite.creationDate     = new Date();
			newFavorite.modificationDate = new Date();
			newFavorite.active           = true;
			newFavorite.user             = user;
			newFavorite.game             = game;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(Favorite).insert(newFavorite);
				return res.status(SuccessCode.OK).json(newFavorite);
			}
			catch (err: any)
			{
				if (err.errno === 1062)
				{
					return res.status(ClientCode.CONFLICT).json({ message: `The game is already a favorite of that user. Please pick a different user and/or game and try again.` });
				}
				else
				{
					return res.status(ServerCode.INTERNAL_SERVER_ERROR).json({ message: `Something unexpected went wrong. Please contact the support and provide them this following error message: ${ err.message }.` });
				}
			}
		}
		else
		{
			return res
			.status(ClientCode.BAD_REQUEST)
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the user and game are missing. Please make sure that there are a game and user and try again.` });
		}
	}

}

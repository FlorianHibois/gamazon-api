import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { GamePlatform } from "../models/game-platform";
import { Repository } from "typeorm";
import { Game } from "../models/game";
import { Platform } from "../models/platform";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class GamePlatformController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GamePlatform).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const gamePlatform: GamePlatform | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(GamePlatform).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gamePlatform !== null)
		{
			return res.status(SuccessCode.OK).json(gamePlatform);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GamePlatform).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const gamePlatformRepo: Repository<GamePlatform> = DataSourceInformation.mysqlDataSource.getRepository(GamePlatform);
		const gamePlatform: GamePlatform | null          = req.params.id ? await gamePlatformRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gamePlatform)
		{
			const platform: Platform | null = req.body.id_platform ? await DataSourceInformation.mysqlDataSource.getRepository(Platform).findOneBy({ id: parseInt(req.body.id_platform, 10) }) : null;
			const game: Game | null         = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
			gamePlatform.modificationDate   = new Date();
			gamePlatform.game               = game;
			gamePlatform.platform           = platform;

			if (req.body.active)
			{
				gamePlatform.active = req.body.active;
			}

			return res.status(SuccessCode.OK).json(await gamePlatformRepo.save(gamePlatform));
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
		const platform: Platform | null = req.body.id_platform ? await DataSourceInformation.mysqlDataSource.getRepository(Platform).findOneBy({ id: parseInt(req.body.id_platform, 10) }) : null;
		const game: Game | null         = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
		if (game && platform)
		{
			const newGamePlatform: GamePlatform = new GamePlatform();
			newGamePlatform.creationDate        = new Date();
			newGamePlatform.modificationDate    = new Date();
			newGamePlatform.active              = true;
			newGamePlatform.platform            = platform;
			newGamePlatform.game                = game;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(GamePlatform).insert(newGamePlatform);
				return res.status(SuccessCode.OK).json(newGamePlatform);
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
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the platform and game are missing. Please make sure that there are a game and platform and try again.` });
		}
	}
}

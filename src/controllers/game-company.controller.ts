import { AbstractController } from "./abstract.controller";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { DataSourceInformation } from "../data-source";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { Game } from "../models/game";
import { GameCompany } from "../models/game-company";
import { Company } from "../models/company";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class GameCompanyController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GameCompany).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const gameCompany: GameCompany | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(GameCompany).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gameCompany !== null)
		{
			return res.status(SuccessCode.OK).json(gameCompany);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(GameCompany).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const gameCompanyRepo: Repository<GameCompany> = DataSourceInformation.mysqlDataSource.getRepository(GameCompany);
		const gameCompany: GameCompany | null          = req.params.id ? await gameCompanyRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (gameCompany)
		{
			const company: Company | null = req.body.id_company ? await DataSourceInformation.mysqlDataSource.getRepository(Company).findOneBy({ id: parseInt(req.body.id_company, 10) }) : null;
			const game: Game | null       = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
			gameCompany.modificationDate  = new Date();
			gameCompany.active            = req.body.active;
			gameCompany.game              = game;
			gameCompany.company           = company;

			if (req.body.is_developer)
			{
				gameCompany.isDeveloper = req.body.is_developer;
			}

			if (req.body.is_editor)
			{
				gameCompany.isEditor = req.body.is_editor;
			}

			return res.status(SuccessCode.OK).json(await gameCompanyRepo.save(gameCompany));
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
		const company: Company | null = req.body.id_company ? await DataSourceInformation.mysqlDataSource.getRepository(Company).findOneBy({ id: parseInt(req.body.id_company, 10) }) : null;
		const game: Game | null       = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
		if (company && game)
		{
			const newGameCompany: GameCompany = new GameCompany();
			newGameCompany.creationDate       = new Date();
			newGameCompany.modificationDate   = new Date();
			newGameCompany.active             = true;
			newGameCompany.isDeveloper        = req.body.is_developer || false;
			newGameCompany.isEditor           = req.body.is_editor || false;
			newGameCompany.company            = company;
			newGameCompany.game               = game;

			try
			{
				await DataSourceInformation.mysqlDataSource.getRepository(GameCompany).insert(newGameCompany);
				return res.status(SuccessCode.OK).json(newGameCompany);
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
			.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the company and game are missing. Please make sure that there are a game and company and try again.` });
		}
	}
}

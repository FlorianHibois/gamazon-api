import { Request, Response } from "express";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { Rating } from "../models/rating";
import { AbstractController } from "./abstract.controller";
import { Repository } from "typeorm";
import { User } from "../models/user";
import { Game } from "../models/game";
import { StringManipulator } from "../utils/string-manipulator";
import { final } from "../decorators/final";

@final
export class RatingController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Rating).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const rating: Rating | null = req.params.id ? await DataSourceInformation.mysqlDataSource.getRepository(Rating).findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (rating !== null)
		{
			return res.status(SuccessCode.OK).json(rating);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not found. Please make sure you chose an existing one.` });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(Rating).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		const ratingRepo: Repository<Rating> = DataSourceInformation.mysqlDataSource.getRepository(Rating);
		const rating: Rating | null          = req.params.id ? await ratingRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (rating)
		{
			const user: User | null = req.body.id_user ? await DataSourceInformation.mysqlDataSource.getRepository(User).findOneBy({ id: parseInt(req.body.id_user, 10) }) : null;
			const game: Game | null = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
			if (user && game)
			{
				if (req.body.rate && req.body.message)
				{
					rating.modificationDate = new Date();
					rating.rate             = req.body.rate;
					rating.message          = req.body.message;
					rating.user             = user;
					rating.game             = game;

					if (req.body.active)
					{
						rating.active = req.body.active;
					}

					return res.status(SuccessCode.OK).json(await ratingRepo.save(rating));
				}
				else
				{
					return res
					.status(ClientCode.BAD_REQUEST)
					.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not updated because the rate and/or message are missing. Please make sure that there are a rate and a message and try again.` });
				}
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
		const user: User | null = req.body.id_user ? await DataSourceInformation.mysqlDataSource.getRepository(User).findOneBy({ id: parseInt(req.body.id_user, 10) }) : null;
		const game: Game | null = req.body.id_game ? await DataSourceInformation.mysqlDataSource.getRepository(Game).findOneBy({ id: parseInt(req.body.id_game, 10) }) : null;
		if (user && game)
		{
			if (req.body.rate && req.body.message)
			{
				const newRating: Rating    = new Rating();
				newRating.creationDate     = new Date();
				newRating.modificationDate = new Date();
				newRating.active           = true;
				newRating.rate             = req.body.rate;
				newRating.message          = req.body.message;
				newRating.user             = user;
				newRating.game             = game;

				try
				{
					await DataSourceInformation.mysqlDataSource.getRepository(Rating).insert(newRating);
					return res.status(SuccessCode.OK).json(newRating);
				}
				catch (err: any)
				{
					if (err.errno === 1062)
					{
						return res.status(ClientCode.CONFLICT).json({ message: `The rating for the pair user/game already exists. Please pick a different user and/or game and try again.` });
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
				.json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the rate and/or message are missing. Please make sure that there are a rate and a message and try again.` });
			}
		}
		else
		{
			return res.status(ClientCode.BAD_REQUEST).json({ message: `The ${ StringManipulator.extractFileName(__filename) } was not created because the user and game are missing. Please make sure that there are a game and user and try again.` });
		}
	}
}

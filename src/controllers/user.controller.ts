// Imports DB's connection and packages
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { HashSalt } from "../utils/hash-salt";
import { AbstractController } from "./abstract.controller";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import { DataSourceInformation } from "../data-source";
import { User } from "../models/user";
import { Permission } from "../models/permission";
import { Repository } from "typeorm";
import { final } from "../decorators/final";
import fs from "fs";

@final
export class UserController extends AbstractController
{
	public async getAll(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(User).find());
	}

	public async getOne(req: Request, res: Response): Promise<any>
	{
		const user: User | null = await DataSourceInformation.mysqlDataSource.getRepository(User).findOneBy({ id: parseInt(req.params.id, 10) });
		if (user !== null)
		{
			return res.status(SuccessCode.OK).json(user);
		}
		else
		{
			return res.status(ClientCode.NOT_FOUND).json({ message: "The user was not found. Please make sure you chose an existing one." });
		}
	}

	public async delete(req: Request, res: Response): Promise<any>
	{
		return res.status(SuccessCode.OK).json(await DataSourceInformation.mysqlDataSource.getRepository(User).delete({ id: parseInt(req.params.id, 10) }));
	}

	public async update(req: Request, res: Response): Promise<any>
	{
		let hashedPassword: string | null = null;
		if (req.body.password)
		{
			// Hashing the plain password
			hashedPassword = await bcrypt.hash(req.body.password, HashSalt.SALT_OR_ROUNDS);
			delete req.body.password;
		}
		const userRepo: Repository<User> = DataSourceInformation.mysqlDataSource.getRepository(User);
		const user: User | null          = req.params.id ? await userRepo.findOneBy({ id: parseInt(req.params.id, 10) }) : null;
		if (user)
		{
			const imageUrl: string | null       = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
			const permission: Permission | null = req.body.id_permission ? await DataSourceInformation.mysqlDataSource.getRepository(Permission).findOneBy({ id: parseInt(req.body.id_permission, 10) }) : null;
			user.creationDate                   = new Date();
			user.modificationDate               = new Date();
			user.active                         = req.body.active;

			if (req.body.userName && user.userName !== req.body.user_name)
			{
				user.userName = req.body.user_name;
			}

			if (hashedPassword && user.password !== hashedPassword)
			{
				user.password = hashedPassword;
			}

			if (user.permission !== permission)
			{
				user.permission = permission;
			}

			if (imageUrl !== user.image)
			{
				if (!imageUrl && user.image)
				{
					let fileName: string = user.image.split(`${ req.protocol }://${ req.get("host") }/images/`).join("");
					fs.unlink(`src/images/${ fileName }`, (): void =>
					{
						console.log(`Image successfully deleted.`);
					});
				}
				user.image = imageUrl;
			}

			return res.status(SuccessCode.OK).json(await userRepo.save(user));
		}
		else
		{
			return res
			.status(ClientCode.NOT_FOUND)
			.json({ message: "Can't update the user. It was not found. Please make sure you chose an existing one." });
		}
	}

	public async create(req: Request, res: Response): Promise<any>
	{
		// Hashing the plain password
		const hashedPassword: string = await bcrypt.hash(req.body.password, HashSalt.SALT_OR_ROUNDS);
		delete req.body.password;
		const imageUrl: string | null       = req.file ? `${ req.protocol }://${ req.get("host") }/images/${ req.file.filename }` : null;
		const permission: Permission | null = req.body.id_permission ? await DataSourceInformation.mysqlDataSource.getRepository(Permission).findOneBy({ id: parseInt(req.body.id_permission, 10) }) : null;
		const newUser: User                 = new User();
		newUser.creationDate                = new Date();
		newUser.modificationDate            = new Date();
		newUser.active                      = true;
		newUser.userName                    = req.body.user_name;
		newUser.password                    = hashedPassword;
		newUser.permission                  = permission;

		if (imageUrl)
		{
			newUser.image = imageUrl;
		}

		try
		{
			await DataSourceInformation.mysqlDataSource.getRepository(User).insert(newUser);
			return res.status(SuccessCode.OK).json(newUser);
		}
		catch (err: any)
		{
			if (err.errno === 1062)
			{
				return res.status(ClientCode.CONFLICT).json({ message: `The username ${ req.body.user_name } already exists. Please pick a unique username and try again.` });
			}
			else
			{
				return res.status(ServerCode.INTERNAL_SERVER_ERROR).json({ message: `Something unexpected went wrong. Please contact the support and provide them this following error message: ${ err.message }.` });
			}
		}
	}
}

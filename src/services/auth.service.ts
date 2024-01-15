import bcrypt from "bcrypt";
import { ClientCode, ServerCode, SuccessCode } from "../utils/status-code-http";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/user";
import { DataSourceInformation } from "../data-source";
import { Repository } from "typeorm";
import { final } from "../decorators/final";

@final
export class AuthService
{
	private static user: User | null;
	private static token: string | null;

	public static async login(req: Request, res: Response): Promise<any>
	{
		try
		{
			const userRepo: Repository<User> = DataSourceInformation.mysqlDataSource.getRepository(User);
			const user: User | null          = await userRepo.findOneBy({
				userName: req.body.user_name,
				active  : true
			});

			if (user)
			{
				const isPasswordCorrect: boolean = await bcrypt.compare(req.body.password, user.password);
				delete req.body.password;
				// Checks if the password from the query is the same that the one that is in the request body
				if (!isPasswordCorrect)
				{
					// If it is not the same, sends an error
					return res.status(ClientCode.UNAUTHORIZED).json({ message: "The password is incorrect. Please make sure to not write caps letters." });
				}
				else
				{
					user.password = "";
					if (!AuthService.user)
					{
						AuthService.user            = new User();
						AuthService.user.id         = user.id;
						AuthService.user.userName   = user.userName;
						AuthService.user.permission = user.permission;
						AuthService.token           = jwt.sign(
							{ userId: user.id },
							process.env.TOKEN_KEY,
							{ expiresIn: "1h" }
						);
						// Otherwise, sends the information in JSON format
						return res.status(SuccessCode.OK).json({
							user : AuthService.user,
							token: AuthService.token,
						});
					}
					else
					{
						if (user.userName === AuthService.user.userName)
						{
							return res
							.status(SuccessCode.OK)
							// @ts-ignore
							.json({ message: `You already are logged in with this credentials. There are ${ req.rateLimit.remaining + 1 } attempts remaining before being blocked for ten minutes.` });
						}
						else
						{
							await AuthService.logout(req, res);
						}
					}
				}
			}
			else
			{
				return res.status(ClientCode.NOT_FOUND).json({ message: `The user name was not found. Please make sure to use an existing one.` });
			}
		}
		catch (err: any)
		{
			return res.status(ServerCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
		}
	}

	public static async logout(req: Request, res: Response): Promise<any>
	{
		try
		{
			if (AuthService.user)
			{
				const userName: string = AuthService.user.userName;
				AuthService.user       = null;
				AuthService.token      = null;
				return res.status(SuccessCode.OK).json({ message: `You have logged out successfully from the account '${ userName }'.` });
			}
			else
			{
				return res.status(SuccessCode.OK).json({ message: `You must log in into an account before logging out.` });
			}
		}
		catch (err: any)
		{
			return res.status(ServerCode.INTERNAL_SERVER_ERROR).json(err);
		}
	}
}

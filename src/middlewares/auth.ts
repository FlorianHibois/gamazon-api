// Import dependencies
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { ClientCode } from "../utils/status-code-http";
import { final } from "../decorators/final";

/**
 * @author felek
 * @version 1.0.0
 */
@final
export class AuthenticationMiddleware
{
	/**
	 * @author felek
	 * @version 1.0.0
	 * Middleware that make sure that a user is logged in before any action
	 * @param req Request sent from the client
	 * @param res Response sent to the client from the server
	 * @param next next middleware in stack
	 * @return Promise<void>
	 */
	public static async auth(req: Request, res: Response, next: NextFunction): Promise<any>
	{
		try
		{
			if (req.header('Authorization'))
			{
				// Retrieve the token from the header by removing the 'Bearer ' string
				const token: string                     = req.header('Authorization')!.replace('Bearer ', '');
				// Using JWT to verify that the encoded token from the header is the same as the one in the .env file
				const decodedToken: JwtPayload | string = jwt.verify(token, process.env.TOKEN_KEY);
				// Retrieve the userId from the decodedToken
				// @ts-ignore
				const userId: number = parseInt(decodedToken.userId, 10);
				// Save the userId to the request
				// @ts-ignore
				req.auth = {
					userId: userId,
				};
				// Call the next function in the stack
				next();
			}
			else
			{
				return res.status(ClientCode.EXPECTATION_FAILED).json({ message: `The token is missing from the request. Please make sure to be logged in before reaching this page.` });
			}
		}
		catch (err: any)
		{
			res.status(ClientCode.UNAUTHORIZED).json(err.message);
		}
	}
}

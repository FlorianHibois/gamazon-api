import { final } from "../decorators/final";
import sharp from "sharp";
import { NextFunction, Request, Response } from "express";
import { MimeType } from "../utils/mime-type";
import { ClientCode } from "../utils/status-code-http";

@final
export class Sharp
{
	public static async checkFile(req: Request, res: Response, next: NextFunction): Promise<any>
	{
		// Possible mime types for uploaded images
		if (req.file)
		{
			const name: string      = req.file.originalname.split(" ").join("_").split(/[.]\w+$/g).join("") ?? Date.now().toString();
			const extension: string = MimeType.mime_types[req.file.mimetype];
			const path: string      = name + Date.now() + "." + extension;
			if (extension && path)
			{
				await sharp(req.file.buffer)
				.resize({ width: 520 })
				.toFile(`src/images/${ path }`);
				//the new name of the file is saved in the req, to be used by controllers
				req.file.filename = path;
			}
			else
			{
				return res.status(ClientCode.BAD_REQUEST).json({ message: `The image is not in a supported format. You can only upload JPG, JPEG or PNG images.` });
			}
		}
		next();
	}
}



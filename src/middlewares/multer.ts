import { final } from "../decorators/final";
import multer from "multer";
import { RequestHandler } from "express";


@final
export class Multer
{
	// Configuration of multer : in this case, memoryStorage is used instead of diskStorage, to obtain a buffer for the image used by sharp in the next middleware.
	// The save of the image in the folder 'images' is also done by sharp.
	public static storage: multer.StorageEngine = multer.memoryStorage();
	public static upload: RequestHandler<any>   = multer({
		storage: Multer.storage,
		limits : {
			fileSize: 5242880 // 5Mo
		}
	}).single("image");
}


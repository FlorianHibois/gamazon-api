import { DataSource } from "typeorm"
import { Classification } from "./models/classification";
import { Company } from "./models/company";
import { Game } from "./models/game";
import { GameCompany } from "./models/game-company";
import { GamePlatform } from "./models/game-platform";
import { Genre } from "./models/genre";
import { Permission } from "./models/permission";
import { Platform } from "./models/platform";
import { Favorite } from "./models/favorite";
import { User } from "./models/user";
import "dotenv/config";
import { Rating } from "./models/rating";
import { GameGenre } from "./models/game-genre";

export class DataSourceInformation
{
	public static mysqlDataSource: DataSource = new DataSource({
		type    : "mysql",
		host    : process.env.DB_HOST,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		// port       : process.env.DB_PORT,
		entities     : [
			Classification,
			Company,
			Favorite,
			Game,
			GameCompany,
			GameGenre,
			GamePlatform,
			Genre,
			Permission,
			Platform,
			Rating,
			User
		],
		synchronize  : false,
		logging      : "all",
		subscribers  : [],
		migrations   : [],
		migrationsRun: false
	});
}

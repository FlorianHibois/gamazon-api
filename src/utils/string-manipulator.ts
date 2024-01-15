// Import dependencies
import dotenv from "dotenv";
import { final } from "../decorators/final";

// Loading of the .env file into process.env
dotenv.config();

/**
 * @author felek
 * @version 1.0.0
 * Creation of an enumeration to avoid using hard coded numbers
 */
enum Port
{
	MIN_PORT_NUMBER = 0,
	MAX_PORT_NUMBER = 65536,
}

/**
 * @author felek
 * @version 1.0.0
 */
@final
export class StringManipulator
{

	/**
	 * Capitalizes the first letter of a string
	 * @param {string} string string to manipulate
	 * @returns string with firsts letter capitalized
	 */
	public static capitalize(string: string): string
	{
		return string[0].toUpperCase() + string.slice(1).toLowerCase();
	}

	/**
	 * @author felek
	 * @version 1.0.0
	 * Checks the value if this matches the port criteria and returns it (as string or number format)
	 * @return the port number formatted as a string or number
	 * @param port
	 */
	public static normalizePort(port: number): number
	{

		/* Checks if the port number is between the minimal and maximum value authorized
		for a port number */
		if (port >= Port.MIN_PORT_NUMBER && port < Port.MAX_PORT_NUMBER)
		{
			return port;
		}
		else
		{
			// If the port number is not allowed, return the default value,
			// specified in the .env file (loaded into process.env via the config() method)
			return process.env.API_PORT!;
		}
	}

	public static isEmpty(s: string): boolean
	{
		return s.trim() === "";
	}

	public static extractFileName(fileName: string): string
	{
		const array: Array<string> = fileName.split("/");
		let tableName: string      = array[array.length - 1];
		return tableName.includes('-') ?
			tableName.split('.')[0].replace('-', '_')
			:
			tableName.split('.')[0];
	}
}

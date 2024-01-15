declare namespace NodeJS
{
	/**
	 * Overriding types of the .env parameters
	 *
	 */
	export interface ProcessEnv
	{
		// Database information
		DB_HOST: string;
		DB_URL: string;
		DB_NAME: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_PORT: number;

		// Token information
		TOKEN_KEY: string;

		// API port information
		API_PORT: number;
	}
}

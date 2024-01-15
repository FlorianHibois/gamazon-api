import { app } from "./index";
import { StringManipulator } from "./utils/string-manipulator";

// Launching the server
try
{
	const port: number = StringManipulator.normalizePort(process.env.API_PORT!);
	app.set("port", port);
	app.listen(port, (): void =>
	{
		console.log(`Listening on port ${ port }`);
	});
}
catch (e: any)
{
	throw e;
}

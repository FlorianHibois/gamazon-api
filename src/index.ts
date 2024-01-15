//
import cors from 'cors';
import express, { Express } from "express";
import { DataSourceInformation } from "./data-source";
import * as dotenv from "dotenv";
import { Routes } from "./routes";
import path from "path";

dotenv.config();

// Establish database connection
DataSourceInformation.mysqlDataSource
.initialize()
.then((): void =>
{
	console.log("Data Source has been initialized!");
})
.catch((err): void =>
{
	console.error("Error during Data Source initialization:", err);
});

export const app: Express = express();

//
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

Routes.initializeRoutes();

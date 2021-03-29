import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser';
import {Routes} from './src/routes/apiRoutes';
dotenv.config();

const app = express();
app.use(bodyParser.json());

const routes = [];
routes.push(new Routes(app));

export default app;

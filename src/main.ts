import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { routes } from "./router";

export const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

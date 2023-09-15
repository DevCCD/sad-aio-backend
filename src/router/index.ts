import "dotenv/config";
import { Application, Router } from "express";
import {
	DistritoRouter,
	UgtRouter,
	PeriodoRouter,
	IdhRouter,
	ProyectosRouter,
	BrechasRouter,
	BrechasFinancierasRouter,
	RecursoRouter,
	InversionSocialRouter,
	PotencialidadRouter,
	PotencialRouter,
	PeruRouter,
	ResumenRouter,
} from "../app";

const apiVersion = process.env.API_VERSION || "v1";

const router = Router();

const listRoutes: [string, Router][] = [
	// selects
	["/ugt", UgtRouter],
	["/distrito", DistritoRouter],
	["/periodo", PeriodoRouter],

	// pages
	["/idh", IdhRouter],
	["/proyectos", ProyectosRouter],

	// brechas
	["/brechas", BrechasRouter],
	["/brechas-financieras", BrechasFinancierasRouter],

	// recursos
	["/recursos", RecursoRouter],

	// inversion social
	["/inversion-social", InversionSocialRouter],

	// potencialidad
	["/potencialidad", PotencialidadRouter],
	["/potencial", PotencialRouter],

	// peru
	["/peru", PeruRouter],

	// paginas data
	["/resumen", ResumenRouter],
];

export const routes = (app: Application) => {
	for (const [path, subRouter] of listRoutes) {
		try {
			app.use(`/api/${apiVersion}${path}`, subRouter);
		} catch (error) {
			console.error(`Error al cargar las rutas de ${path}: ${error}`);
		}
	}
};

export default router;

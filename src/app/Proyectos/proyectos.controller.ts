import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllProyectos = async (req: Request, res: Response) => {
	try {
		const proyectos = await prisma.proyecto.findMany();

		res.status(200).json(proyectos);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

export const getProyectoById = async (req: Request, res: Response) => {
	try {
		res.status(200).json({
			ok: true,
			msg: "getProyectoById",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

export const createProyecto = async (req: Request, res: Response) => {
	try {
		const {
			distritoNombre,
			name_proyecto,
			time_frame,
			entidad,
			tipo_inversion,
			monto_actualizado,
			coords,
			periodos,
			factores,
			conclusion,
		} = req.body;

		const proyecto = await prisma.proyecto.create({
			data: {
				distritoNombre,
				name_proyecto,
				time_frame,
				entidad,
				tipo_inversion,
				monto_actualizado,
				coords,
				periodos,
				factores,
				conclusion,
			},
		});

		res.status(200).json({
			ok: true,
			proyecto,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

export const createManyProyectos = async (req: Request, res: Response) => {
	try {
		const dataProyectosArray = req.body;

		const proyectos = await prisma.proyecto.createMany({
			data: dataProyectosArray,
		});

		res.status(200).json({
			ok: true,
			proyectos,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

export const updateProyecto = async (req: Request, res: Response) => {
	try {
		res.status(200).json({
			ok: true,
			msg: "updateProyecto",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

export const deleteProyecto = async (req: Request, res: Response) => {
	try {
		res.status(200).json({
			ok: true,
			msg: "deleteProyecto",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Error inesperado... revisar logs",
		});
	}
};

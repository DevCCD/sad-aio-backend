import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Recurso } from "@prisma/client";

export const getAllRecursos = async (req: Request, res: Response) => {
	try {
		const recursos = await prisma.recurso.findMany();
		res.status(200).json(recursos);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al obtener todos los Recursos",
		});
	}
};

export const getRecurso = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const OnRecurso = await prisma.recurso.findUnique({
			where: {
				id,
			},
		});

		if (!OnRecurso)
			return res.status(404).json({ message: "Recurso no encontrado" });

		res.status(200).json(OnRecurso);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el Recurso" });
	}
};

export const createRecurso = async (req: Request, res: Response) => {
	try {
		const { distritoNombre, anio, valor } = req.body as Recurso;

		if (!distritoNombre || !anio) {
			return res
				.status(400)
				.json({ message: "Todos los campos son obligatorios" });
		}

		const distrito = await prisma.distrito.findUnique({
			where: {
				nombre: distritoNombre,
			},
		});

		if (!distrito) {
			return res.status(404).json({ message: "Distrito no encontrado" });
		}

		const recurso = await prisma.recurso.create({
			data: {
				distritoNombre,
				anio,
				valor,
			},
		});

		res.status(201).json(recurso);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear el Recurso" });
	}
};

export const createManyRecursos = async (req: Request, res: Response) => {
	try {
		const recursos = req.body as Recurso[];

		if (!recursos) {
			return res.status(400).json({ message: "No hay recursos" });
		}

		const recursosCreados = await prisma.recurso.createMany({
			data: recursos,
		});

		res.status(201).json(recursosCreados);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear los Recursos" });
	}
};

export const updateRecurso = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { distritoNombre, anio, valor } = req.body as Recurso;

		const recurso = await prisma.recurso.update({
			where: {
				id,
			},
			data: {
				distritoNombre,
				anio,
				valor,
			},
		});

		res.status(200).json(recurso);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar el Recurso" });
	}
};

export const deleteRecurso = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.recurso.delete({
			where: {
				id,
			},
		});

		res.status(200).json({ message: "Recurso eliminado" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar el Recurso" });
	}
};

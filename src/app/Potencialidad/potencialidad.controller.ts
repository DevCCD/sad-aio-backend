import { Request, Response } from "express";
import { Potencialidad } from "@prisma/client";
import prisma from "../../utils/prisma";

export const getAllPotencialidad = async (req: Request, res: Response) => {
	try {
		const potencialidads = await prisma.potencialidad.findMany();
		res.status(200).json(potencialidads);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener potencialidads" });
	}
};

export const getPotencialidad = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const potencialidad = await prisma.potencialidad.findUnique({
			where: { id },
		});
		res.status(200).json(potencialidad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener potencialidad" });
	}
};

export const createPotencialidad = async (req: Request, res: Response) => {
	try {
		const { distritoNombre, potencialNombre } = req.body as Potencialidad;

		const distrito = await prisma.distrito.findUnique({
			where: { nombre: distritoNombre },
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		const potencialidad = await prisma.potencial.findUnique({
			where: { nombre: potencialNombre },
		});

		if (!potencialidad)
			return res
				.status(404)
				.json({ message: "Potencialidad no encontrada" });

		const newPotencialidad = await prisma.potencialidad.create({
			data: {
				distritoNombre,
				potencialNombre,
			},
		});
		res.status(200).json(newPotencialidad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear potencialidad" });
	}
};

export const createManyPotencialidad = async (req: Request, res: Response) => {
	try {
		const potencialidads = req.body as Potencialidad[];
		const newPotencialidad = await prisma.potencialidad.createMany({
			data: potencialidads,
		});
		res.status(200).json(newPotencialidad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear potencialidad" });
	}
};

export const updatePotencialidad = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { distritoNombre, potencialNombre } = req.body as Potencialidad;

		const distrito = await prisma.distrito.findUnique({
			where: { nombre: distritoNombre },
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		const potencialidad = await prisma.potencial.findUnique({
			where: { nombre: potencialNombre },
		});

		if (!potencialidad)
			return res
				.status(404)
				.json({ message: "Potencialidad no encontrada" });

		const updatedPotencialidad = await prisma.potencialidad.update({
			where: { id },
			data: {
				distritoNombre,
				potencialNombre,
			},
		});
		res.status(200).json(updatedPotencialidad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar potencialidad" });
	}
};

export const deletePotencialidad = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deletedPotencialidad = await prisma.potencialidad.delete({
			where: { id },
		});
		res.status(200).json(deletedPotencialidad);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar potencialidad" });
	}
};

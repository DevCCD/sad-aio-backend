import { Request, Response } from "express";
import { Potencial } from "@prisma/client";
import prisma from "../../utils/prisma";

export const getAllPotencial = async (req: Request, res: Response) => {
	try {
		const potencials = await prisma.potencial.findMany({
			include: {
				potencialidades: {
					include: {
						distrito: {
							select: {
								id: true,
								nombre: true,
							},
						},
					},
				},
			},
		});
		res.status(200).json(potencials);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener potencials" });
	}
};

export const getPotencial = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const potencial = await prisma.potencial.findUnique({
			where: { id },
		});
		res.status(200).json(potencial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener potencial" });
	}
};

export const createPotencial = async (req: Request, res: Response) => {
	try {
		const { nombre, icono, hexColor, descripcion } = req.body as Potencial;

		const potencial = await prisma.potencial.findUnique({
			where: { nombre },
		});

		if (potencial)
			return res.status(404).json({ message: "El Potencial ya existe" });

		const newPotencial = await prisma.potencial.create({
			data: { nombre, icono, hexColor, descripcion },
		});

		res.status(200).json(newPotencial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear potencial" });
	}
};

export const createManyPotencial = async (req: Request, res: Response) => {
	try {
		const potencials = req.body as Potencial[];
		const newPotencials = await prisma.potencial.createMany({
			data: potencials,
		});
		res.status(200).json(newPotencials);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear potencial" });
	}
};

export const updatePotencial = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { nombre, icono, hexColor, descripcion } = req.body as Potencial;

		const potencial = await prisma.potencial.findUnique({
			where: { nombre },
		});

		if (!potencial)
			return res.status(404).json({ message: "Potencial no encontrada" });

		const updatedPotencial = await prisma.potencial.update({
			where: { id },
			data: {
				nombre,
				icono,
				hexColor,
				descripcion,
			},
		});
		res.status(200).json(updatedPotencial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar potencial" });
	}
};

export const deletePotencial = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deletedPotencial = await prisma.potencial.delete({
			where: { id },
		});
		res.status(200).json(deletedPotencial);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar potencial" });
	}
};

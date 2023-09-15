import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllBrechas = async (req: Request, res: Response) => {
	try {
		const brechas = await prisma.brecha.findMany();
		res.status(200).json(brechas);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

export const getBrecha = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const brecha = await prisma.brecha.findUnique({
			where: {
				id,
			},
		});
		res.status(200).json(brecha);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

export const createBrecha = async (req: Request, res: Response) => {
	try {
		const { variable, distritoNombre, impacto, periodoValue, porcentaje } =
			req.body;

		if (!variable || !distritoNombre || !periodoValue) {
			return res
				.status(400)
				.json({ message: "Todos los campos son obligatorios" });
		}

		const brecha = await prisma.brecha.create({
			data: {
				variable,
				distritoNombre,
				impacto,
				periodoValue,
				porcentaje,
			},
		});

		res.status(201).json(brecha);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

export const createManyBrechas = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "createManyBrechas" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

export const updateBrecha = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "updateBrecha" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

export const deleteBrecha = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "deleteBrecha" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Hubo un error en el servidor" });
	}
};

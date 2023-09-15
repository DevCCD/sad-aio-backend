import { Request, Response } from "express";
import { Peru } from "@prisma/client";
import prisma from "../../utils/prisma";

export const getPeru = async (req: Request, res: Response) => {
	try {
		const peru = await prisma.peru.findMany();
		res.status(200).json(peru);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al mostrar los datos de la entidad Peru.",
		});
	}
};

export const getPeruById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const peru = await prisma.peru.findUnique({
			where: { id },
		});
		res.status(200).json(peru);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al ingresar datos a la entidad Peru.",
		});
	}
};

export const addPeru = async (req: Request, res: Response) => {
	const { nombre, idhPeru, periodo } = req.body as Peru;
	try {
		const periodoIsExists = await prisma.peru.findUnique({
			where: {
				periodo,
			},
		});

		if (periodoIsExists)
			return res.status(400).json({
				message: "El periodo ya existe",
			});

		const peru = await prisma.peru.create({
			data: {
				nombre,
				idhPeru,
				periodo,
			},
		});
		res.status(200).json(peru);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al ingresar datos a la entidad Peru.",
		});
	}
};

export const addManyPeru = async (req: Request, res: Response) => {
	const peru = req.body as Peru[];
	try {
		const peruCreated = await prisma.peru.createMany({
			data: peru,
		});
		res.status(200).json(peruCreated);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al ingresar datos a la entidad Peru.",
		});
	}
};

export const updatePeru = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { nombre, idhPeru, periodo } = req.body as Peru;
	try {
		const peru = await prisma.peru.update({
			where: {
				id,
			},
			data: {
				nombre,
				idhPeru,
				periodo,
			},
		});
		res.status(200).json(peru);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al actualizar datos de la entidad Peru.",
		});
	}
};

export const deletePeru = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const peru = await prisma.peru.delete({
			where: {
				id,
			},
		});
		res.status(200).json(peru);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al eliminar datos de la entidad Peru.",
		});
	}
};

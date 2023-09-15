import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { BrechaFinanciera } from "@prisma/client";
export const getAllBfs = async (req: Request, res: Response) => {
	try {
		const bf = await prisma.brechaFinanciera.findMany();
		res.status(200).json(bf);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener todos los Bfs" });
	}
};

export const getBf = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const OnBf = await prisma.brechaFinanciera.findUnique({
			where: {
				id,
			},
		});

		if (!OnBf)
			return res
				.status(404)
				.json({ message: "Brecha financiera no encontrada" });

		res.status(200).json(OnBf);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el Bf" });
	}
};

export const createBf = async (req: Request, res: Response) => {
	try {
		const { distritoNombre, periodoValue, monto } =
			req.body as BrechaFinanciera;

		const distrito = await prisma.distrito.findUnique({
			where: {
				nombre: distritoNombre,
			},
		});

		const periodo = await prisma.periodo.findUnique({
			where: {
				value: periodoValue,
			},
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		if (!periodo)
			return res.status(404).json({ message: "Periodo no encontrado" });

		const bf = await prisma.brechaFinanciera.create({
			data: {
				distritoNombre,
				periodoValue,
				monto,
			},
		});

		res.status(201).json(bf);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear el Bf" });
	}
};

export const createManyBfs = async (req: Request, res: Response) => {
	try {
		const bfDataArray = req.body as BrechaFinanciera[];

		const bfArray = await prisma.brechaFinanciera.createMany({
			data: bfDataArray,
		});

		res.status(201).json(bfArray);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear los Bfs" });
	}
};

export const updateBf = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const { distritoNombre, periodoValue, monto } =
			req.body as BrechaFinanciera;

		const distrito = await prisma.distrito.findUnique({
			where: {
				nombre: distritoNombre,
			},
		});

		const periodo = await prisma.periodo.findUnique({
			where: {
				value: periodoValue,
			},
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		if (!periodo)
			return res.status(404).json({ message: "Periodo no encontrado" });

		const bf = await prisma.brechaFinanciera.update({
			where: {
				id,
			},
			data: {
				distritoNombre,
				periodoValue,
				monto,
			},
		});

		res.status(200).json(bf);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar el Bf" });
	}
};

export const deleteBf = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const bf = await prisma.brechaFinanciera.delete({
			where: {
				id,
			},
		});

		res.status(200).json(bf);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar el Bf" });
	}
};

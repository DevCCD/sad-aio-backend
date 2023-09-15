import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAll = async (req: Request, res: Response) => {
	try {
		const idhs = await prisma.idh.findMany();
		res.status(200).json(idhs);
	} catch (error) {
		res.status(500).json({ error: error });
	}
};

export const getOne = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const idh = await prisma.idh.findUnique({
			where: {
				id,
			},
		});
		res.status(200).json(idh);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Ocurrió un error al obtener el IDH papu",
			error: error,
		});
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		const { idh, ingreso_per_capita, periodoValue, distritoNombre } =
			req.body;

		// Verificar si ya existe un registro de IDH para este distrito y periodo
		const existingIdh = await prisma.idh.findFirst({
			where: {
				distritoNombre,
				periodoValue,
			},
		});
		if (existingIdh) {
			return res.status(400).json({
				message:
					"Ya existe un registro de IDH para este distrito y periodo.",
			});
		}

		const newIdh = await prisma.idh.create({
			data: {
				idh,
				ingreso_per_capita,
				periodoValue,
				distritoNombre,
			},
		});

		res.status(201).json(newIdh);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Ocurrió un error al crear el IDH papu",
			error: error,
		});
	}
};

export const createMany = async (req: Request, res: Response) => {
	try {
		const idhDataArray = req.body;

		const createdIdhs = [];

		for (const idhData of idhDataArray) {
			const { idh, ingreso_per_capita, periodoValue, distritoNombre } =
				idhData;

			// verificamos si ya existe un registro de IDH para este distrito y periodo
			const existingIdh = await prisma.idh.findFirst({
				where: {
					distritoNombre,
					periodoValue,
				},
			});

			if (existingIdh) {
				// si ya existe, pasamos al siguiente registro
				continue;
			}

			const newIdh = await prisma.idh.create({
				data: {
					idh,
					ingreso_per_capita,
					periodoValue,
					distritoNombre,
				},
			});
			createdIdhs.push(newIdh);
		}

		res.status(201).json(createdIdhs);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Ocurrió un error al crear el IDH papu",
			error: error,
		});
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { idh, ingreso_per_capita, periodoValue, distritoNombre } =
			req.body;

		const updatedIdh = await prisma.idh.update({
			where: {
				id,
			},
			data: {
				idh,
				ingreso_per_capita,
				periodoValue,
				distritoNombre,
			},
		});

		res.status(200).json({
			message: "IDH actualizado correctamente",
			updatedIdh,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Ocurrió un error al actualizar el IDH papu",
			error: error,
		});
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		await prisma.idh.delete({
			where: {
				id,
			},
		});

		res.status(200).json({
			message: "IDH eliminado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Ocurrió un error al eliminar el IDH papu",
			error: error,
		});
	}
};

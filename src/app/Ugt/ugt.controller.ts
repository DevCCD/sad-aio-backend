import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { UgtData } from "./ugt.interface";

export const getAll = async (req: Request, res: Response) => {
	try {
		const ugts = await prisma.ugt.findMany({
			include: {
				distritos: {
					select: {
						id: true,
						nombre: true,
						coords: true,
					},
				},
			},
			orderBy: {
				ugt: "asc",
			},
		});

		res.status(200).json(ugts);
	} catch (error) {
		res.status(500).json({ message: "Error al obtener las UGTs" });
	}
};

export const getOne = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "getOne" });
	} catch (error) {
		res.status(500).json({ message: "Error al obtener la UGT" });
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		const { ugtName } = req.body;

		const ugt = await prisma.ugt.create({
			data: {
				ugt: ugtName,
			},
		});

		res.status(201).json({ message: "UGT creada exitosamente", data: ugt });
	} catch (error) {
		res.status(500).json({ message: "Error al crear la UGT", data: error });
	}
};

export const createMany = async (req: Request, res: Response) => {
	try {
		const ugtDataArray: UgtData[] = req.body;

		const ugtInsertData = ugtDataArray.map((ugtData) => ({
			ugt: ugtData.ugtName,
		}));

		const createdUgts = await prisma.ugt.createMany({
			data: ugtInsertData,
		});

		res.status(201).json({
			message: "UGTs creados exitosamente",
			createdUgts,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al crear UGTs" });
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const { ugtId } = req.params;
		const { ugtName } = req.body;

		const updatedUgt = await prisma.ugt.update({
			where: {
				id: ugtId,
			},
			data: {
				ugt: ugtName,
			},
		});

		res.status(200).json({
			message: "UGT actualizada exitosamente",
			data: updatedUgt,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al actualizar UGT" });
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		const { ugtId } = req.params;

		const deletedUgt = await prisma.ugt.delete({
			where: {
				id: ugtId,
			},
		});

		res.status(200).json({
			message: "UGT eliminada exitosamente",
			data: deletedUgt,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error al eliminar UGT" });
	}
};

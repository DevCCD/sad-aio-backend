import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { InversionSocial } from "@prisma/client";

export const getAllIs = async (req: Request, res: Response) => {
	try {
		const is = await prisma.inversionSocial.findMany();
		res.status(200).json(is);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener todos los Is" });
	}
};

export const getIs = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const OneIs = await prisma.inversionSocial.findUnique({
			where: {
				id,
			},
		});

		if (!OneIs)
			return res
				.status(404)
				.json({ message: "Inversion social no encontrada" });

		res.status(200).json(OneIs);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el Is" });
	}
};

export const createIs = async (req: Request, res: Response) => {
	try {
		const { distritoNombre, anio, monto } = req.body as InversionSocial;

		const distrito = await prisma.distrito.findUnique({
			where: {
				nombre: distritoNombre,
			},
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		const is = await prisma.inversionSocial.create({
			data: {
				anio,
				monto,
				distritoNombre,
			},
		});

		res.status(201).json(is);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al registrar la Inversión Social",
		});
	}
};

export const createManyIs = async (req: Request, res: Response) => {
	try {
		const isArray: {
			distritoNombre: string;
			anio: string;
			monto: number;
		}[] = req.body;

		const createdIs = [];

		for (const is of isArray) {
			const distrito = await prisma.distrito.findUnique({
				where: {
					nombre: is.distritoNombre,
				},
			});

			if (!distrito)
				return res
					.status(404)
					.json({ message: "Distrito no encontrado" });

			const newIs = await prisma.inversionSocial.create({
				data: {
					anio: is.anio,
					monto: is.monto,
					distritoNombre: is.distritoNombre,
				},
			});

			createdIs.push(newIs);
		}

		res.status(201).json(createdIs);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al registrar las Inversiones Sociales",
		});
	}
};

export const updateIs = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { distritoNombre, anio, monto } = req.body as InversionSocial;

		const distrito = await prisma.distrito.findUnique({
			where: {
				nombre: distritoNombre,
			},
		});

		if (!distrito)
			return res.status(404).json({ message: "Distrito no encontrado" });

		const is = await prisma.inversionSocial.update({
			where: {
				id,
			},
			data: {
				anio,
				monto,
				distritoNombre,
			},
		});

		res.status(200).json(is);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar el Is" });
	}
};

export const deleteIs = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const is = await prisma.inversionSocial.delete({
			where: {
				id,
			},
		});

		res.status(200).json(is);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar el Is" });
	}
};

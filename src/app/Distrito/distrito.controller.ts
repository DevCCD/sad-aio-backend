import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { Distrito } from "@prisma/client";

export const getAllDistrito = async (req: Request, res: Response) => {
	try {
		const distritos = await prisma.distrito.findMany({
			include: {
				potencialidades: {
					orderBy: {
						potencialNombre: "asc",
					},
					select: {
						id: true,
						potencialNombre: true,
						potencial: true,
					},
				},
			},
		});

		const newDistritos = distritos.map((distrito) => {
			const potencialidades = distrito.potencialidades.map(
				(potencialidad) => {
					return {
						id: potencialidad.id,
						nombre: potencialidad.potencialNombre,
						icono: potencialidad.potencial.icono,
						hexColor: potencialidad.potencial.hexColor,
					};
				}
			);

			return {
				id: distrito.id,
				nombre: distrito.nombre,
				coords: distrito.coords,
				potencialidades: potencialidades,
			};
		});

		res.status(200).json(newDistritos);
	} catch (error) {
		res.status(500).json({ message: "Error al obtener los Distrito" });
	}
};

export const getDistritoById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const distrito = await prisma.distrito.findUnique({
			where: {
				id: id,
			},
			include: {
				potencialidades: {
					orderBy: {
						potencialNombre: "asc",
					},
					select: {
						id: true,
						potencialNombre: true,
						potencial: true,
					},
				},
			},
		});

		if (!distrito) {
			return res.status(404).json({ message: "El Distrito no existe" });
		}
		const newDistrito = {
			id: distrito.id,
			nombre: distrito.nombre,
			coords: distrito.coords,
			potencialidades: distrito.potencialidades.map((potencialidad) => {
				return {
					id: potencialidad.id,
					nombre: potencialidad.potencialNombre,
					icono: potencialidad.potencial.icono,
					hexColor: potencialidad.potencial.hexColor,
				};
			}),
		};

		res.status(200).json(newDistrito);
	} catch (error) {}
};

export const registerDistrito = async (req: Request, res: Response) => {
	try {
		const { distrito, coords, ugt } = req.body;

		const ugtExists = await prisma.ugt.findUnique({
			where: {
				ugt: ugt,
			},
		});

		if (!ugtExists) {
			return res.status(400).json({ message: "La UGT no existe" });
		}

		const distritoExists = await prisma.distrito.findUnique({
			where: {
				nombre: distrito,
			},
		});

		if (distritoExists) {
			return res.status(400).json({ message: "El distrito ya existe" });
		}

		const newDistrito = await prisma.distrito.create({
			data: {
				nombre: distrito,
				coords: coords,
				ugtId: ugtExists.id,
			},
		});

		res.status(201).json(newDistrito);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al registrar el Distrito" });
	}
};

export const registerManyDistrito = async (req: Request, res: Response) => {
	try {
		const distritosArray: {
			nombre: string;
			coords: string;
			ugt: string;
		}[] = req.body;

		const createdDistritos = [];

		for (const distrito of distritosArray) {
			const { nombre, coords, ugt } = distrito;

			// buscar si existe la ugt y obtener su id
			const ugtExists = await prisma.ugt.findUnique({
				where: {
					ugt: ugt,
				},
			});

			if (!ugtExists) {
				return res
					.status(400)
					.json({ message: `La UGT ${ugt} no existe` });
			}

			const distritoExists = await prisma.distrito.findUnique({
				where: {
					nombre: nombre,
				},
			});

			if (distritoExists) {
				return res
					.status(400)
					.json({ message: `El distrito ${nombre} ya existe` });
			}

			const newDistrito = await prisma.distrito.create({
				data: {
					nombre: nombre,
					coords: coords,
					ugtId: ugtExists.id,
				},
			});

			createdDistritos.push(newDistrito);
		}

		res.status(201).json(createdDistritos);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al registrar los Distritos" });
	}
};

export const updateDistrito = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "updateDistrito" });
	} catch (error) {}
};

export const deleteDistrito = async (req: Request, res: Response) => {
	try {
		res.status(200).json({ message: "deleteDistrito" });
	} catch (error) {}
};

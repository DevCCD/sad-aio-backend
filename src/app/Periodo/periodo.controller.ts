import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAll = async (req: Request, res: Response) => {
	try {
		const allPeriodos = await prisma.periodo.findMany();

		const sortedPeriodos = allPeriodos.sort((a, b) => {
			const aIsFiveDigits = a.value.length === 5;
			const bIsFiveDigits = b.value.length === 5;

			if (aIsFiveDigits && !bIsFiveDigits) {
				return -1;
			} else if (!aIsFiveDigits && bIsFiveDigits) {
				return 1;
			}

			if (aIsFiveDigits && bIsFiveDigits) {
				const aYear = a.value.slice(1);
				const bYear = b.value.slice(1);
				if (aYear !== bYear) {
					return aYear.localeCompare(bYear);
				} else {
					return a.value[0].localeCompare(b.value[0]);
				}
			} else {
				return a.value.localeCompare(b.value);
			}
		});

		res.status(200).json(sortedPeriodos);
	} catch (error) {}
};

export const getById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({ message: "No se envio un id" });
		}
		const periodo = await prisma.periodo.findUnique({ where: { id } });
		res.status(200).json(periodo);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al obtener el periodo" });
	}
};

export const create = async (req: Request, res: Response) => {
	try {
		const { value }: { value: string } = req.body;

		if (!value) {
			return res.status(400).json({ message: "No se envio un valor" });
		}

		let titulo: string;
		if (value.length === 4) {
			titulo = value;
		} else if (value.length > 4) {
			const periodo = value[0];
			const year = value.slice(1);
			titulo = `${periodo}T ${year}`;
		} else {
			return res
				.status(400)
				.json({ message: "El valor enviado no es valido" });
		}

		const createPeriodo = await prisma.periodo.create({
			data: {
				titulo,
				value,
			},
		});
		res.status(201).json({
			message: "Periodo creado correctamente",
			data: createPeriodo,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear el periodo" });
	}
};

export const createMany = async (req: Request, res: Response) => {
	try {
		const periodoDataArray: { value: string }[] = req.body;

		if (!periodoDataArray) {
			return res.status(400).json({ message: "No se envio un valor" });
		}

		// Filtrar elementos duplicados y verificar si existen en la base de datos
		const uniquePeriodoDataArray = await Promise.all(
			periodoDataArray.map(async (periodoData) => {
				const existingPeriodo = await prisma.periodo.findUnique({
					where: { value: periodoData.value },
				});

				if (!existingPeriodo) {
					return periodoData;
				}
			})
		);

		// filtrar elementos undefined y crear los periodos
		const validPeriodoDataArray = await Promise.all(
			uniquePeriodoDataArray.map(async (periodoData) => {
				if (periodoData) {
					let titulo: string;
					if (periodoData.value.length === 4) {
						titulo = periodoData.value;
					} else if (periodoData.value.length > 4) {
						const periodo = periodoData.value[0];
						const year = periodoData.value.slice(1);
						titulo = `${periodo}T ${year}`;
					} else {
						return res
							.status(400)
							.json({ message: "El valor enviado no es valido" });
					}

					const createPeriodo = await prisma.periodo.create({
						data: {
							titulo,
							value: periodoData.value,
						},
					});
					return createPeriodo;
				}
			})
		);

		res.status(200).json(validPeriodoDataArray);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al crear los periodos" });
	}
};

export const update = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { value }: { value: string } = req.body;

		if (!value) {
			return res.status(400).json({ message: "No se envio un valor" });
		}

		let titulo: string;
		if (value.length === 4) {
			titulo = value;
		} else if (value.length > 4) {
			const periodo = value[0];
			const year = value.slice(1);
			titulo = `${periodo}T ${year}`;
		} else {
			return res
				.status(400)
				.json({ message: "El valor enviado no es valido" });
		}

		const updatePeriodo = await prisma.periodo.update({
			where: { id },
			data: {
				titulo,
				value,
			},
		});
		res.status(200).json({
			message: "Periodo actualizado correctamente",
			data: updatePeriodo,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al actualizar el periodo" });
	}
};

export const deleteById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const deletePeriodo = await prisma.periodo.delete({ where: { id } });
		res.status(200).json({
			message: "Periodo eliminado correctamente",
			data: deletePeriodo,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error al eliminar el periodo" });
	}
};

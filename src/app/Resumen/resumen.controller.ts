import { Request, Response } from "express";
import {
	Idh,
	Brecha,
	BrechaFinanciera,
	Proyecto,
	InversionSocial,
} from "@prisma/client";
import prisma from "../../utils/prisma";

type IdhResult = {
	idh: number;
	ingreso_per_capita: number;
};
const getIdh = async (
	distritoId: string,
	periodo: string
): Promise<IdhResult | null> => {
	const datosFiltrados = (await prisma.idh.findMany({
		where: {
			distrito: { id: distritoId },
			periodoValue: periodo,
		},
	})) as Idh[];

	if (datosFiltrados.length === 0) {
		return null;
	}

	const resultado = {
		idh: datosFiltrados[0].idh,
		ingreso_per_capita: datosFiltrados[0].ingreso_per_capita,
	};

	return resultado as IdhResult;
};

const getBrechas = async (distritoId: string, periodo: string) => {
	const variablesMasna = [
		"Total",
		"Institucionalidad Madura",
		"Oportunidades para las futuras generaciones",
		"Infraestructura social y productiva",
		"Emprendimiento y desarrollo económico",
		"Emergencias",
	];

	const brechasFilter = (await prisma.brecha.findMany({
		where: {
			distrito: {
				id: distritoId,
			},
			periodoValue: periodo,
			variable: {
				in: variablesMasna,
			},
			impacto: true,
		},
		select: {
			variable: true,
			porcentaje: true,
		},
	})) as Brecha[];

	// Ordenar la data según el orden de las variablesMasna
	const dataOrdenada = variablesMasna.map((variable) => {
		const brecha = brechasFilter.find((item) => item.variable === variable);
		return brecha || { variable, porcentaje: null };
	});

	return dataOrdenada;
};

type BrechaFinancieraResult = {
	error?: string;
	data?: any;
	brecha_financiera?: number;
};

const getDistritoById = async (distritoId: string) => {
	try {
		const distrito = await prisma.distrito.findUnique({
			where: {
				id: distritoId,
			},
		});

		if (!distrito) {
			return null;
		}

		return distrito;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getBrechaFinanciera = async (
	distritoId: string,
	periodo: string
): Promise<BrechaFinancieraResult> => {
	try {
		// primero buscamos el distrito por su id
		const distrito = await getDistritoById(distritoId);

		if (!distrito)
			return {
				error: "No se encontraron datos para la brecha financiera",
			};

		if (distrito.nombre === "AIO") {
			const bfs = await prisma.brechaFinanciera.findMany({
				where: {
					periodoValue: periodo,
				},
			});

			if (bfs.length === 0)
				return {
					error: "No se encontraron datos para la brecha financiera",
				};

			const sumarMontos = bfs.reduce(
				(acu, brecha) => acu + brecha.monto,
				0
			);

			return {
				brecha_financiera: sumarMontos,
			};
		}

		// buscamos la brecha financiera por su distrito y periodo
		const brechaFinanciera = await prisma.brechaFinanciera.findFirst({
			where: {
				distrito: {
					id: distritoId,
				},
				periodoValue: periodo,
			},
		});

		if (!brechaFinanciera)
			return {
				error: "No se encontraron datos para la brecha financiera",
			};

		return {
			brecha_financiera: brechaFinanciera.monto,
		};
	} catch (error) {
		console.log(error);
		return {
			error: "Error al mostrar los datos de la brecha financiera",
		};
	}
};

const getProyecto = async (distritoId: string, periodo: string) => {
	try {
		// si el distrito es AIO, entonces se muestran todos los proyectos
		const distrito = await getDistritoById(distritoId);

		if (!distrito)
			return {
				error: "No se encontraron datos para la cartera de proyectos",
			};

		if (distrito.nombre === "AIO") {
			const proyectos = await prisma.proyecto.findMany({
				where: {
					periodos: {
						hasSome: [periodo],
					},
				},
				select: {
					distritoNombre: true,
					monto_actualizado: true,
					time_frame: true,
				},
			});

			const total = {
				numero: proyectos.length,
				monto: proyectos.reduce(
					(acu, proyecto) => acu + proyecto.monto_actualizado,
					0
				),
			};

			const filterPorPlazoAndReduce = (plazo: string) => {
				const filterPlazo = proyectos.filter(
					(proyecto) => proyecto.time_frame === plazo
				);

				const monto = filterPlazo.reduce(
					(acu, proyecto) => acu + proyecto.monto_actualizado,
					0
				);

				return {
					numero: filterPlazo.length,
					monto,
				};
			};

			const corto_plazo = {
				...filterPorPlazoAndReduce("Corto Plazo"),
			};

			const mediano_plazo = {
				...filterPorPlazoAndReduce("Mediano Plazo"),
			};

			const largo_plazo = {
				...filterPorPlazoAndReduce("Largo Plazo"),
			};

			const proyectos_cartera = {
				total,
				corto_plazo,
				mediano_plazo,
				largo_plazo,
			};

			return proyectos_cartera;
		}

		const proyectos = await prisma.proyecto.findMany({
			where: {
				distrito: {
					id: distritoId,
				},
				periodos: {
					hasSome: [periodo],
				},
			},
			select: {
				distritoNombre: true,
				monto_actualizado: true,
				time_frame: true,
			},
		});

		const total = {
			numero: proyectos.length,
			monto: proyectos.reduce(
				(acu, proyecto) => acu + proyecto.monto_actualizado,
				0
			),
		};

		const filterPorPlazoAndReduce = (plazo: string) => {
			const filterPlazo = proyectos.filter(
				(proyecto) => proyecto.time_frame === plazo
			);

			const monto = filterPlazo.reduce(
				(acu, proyecto) => acu + proyecto.monto_actualizado,
				0
			);

			return {
				numero: filterPlazo.length,
				monto,
			};
		};

		const corto_plazo = {
			...filterPorPlazoAndReduce("Corto Plazo"),
		};

		const mediano_plazo = {
			...filterPorPlazoAndReduce("Mediano Plazo"),
		};

		const largo_plazo = {
			...filterPorPlazoAndReduce("Largo Plazo"),
		};

		const proyectos_cartera = {
			total,
			corto_plazo,
			mediano_plazo,
			largo_plazo,
		};

		return proyectos_cartera;
	} catch (error) {
		console.log(error);
		return {
			error: "Error al mostrar los datos de la cartera de proyectos",
		};
	}
};

type Recursos = {
	regalia_menor: number;
	regalia_media: number;
	regalia_mayor: number;
};
const getRecursos = async (distritoId: string): Promise<Recursos> => {
	try {
		const recursos = await prisma.recurso.findMany({
			where: {
				distrito: {
					id: distritoId,
				},
			},
		});

		const regalia_menor = recursos
			.filter(
				(recurso) =>
					parseInt(recurso.anio) >= 2007 &&
					parseInt(recurso.anio) <= 2021
			)
			.reduce((total, recurso) => total + recurso.valor, 0);

		const regalia_media = recursos
			.filter((recurso) => recurso.anio === "2022")
			.reduce((total, recurso) => total + recurso.valor, 0);

		const regalia_mayor = recursos
			.filter(
				(recurso) =>
					parseInt(recurso.anio) >= 2023 &&
					parseInt(recurso.anio) <= 2036
			)
			.reduce((total, recurso) => total + recurso.valor, 0);

		return {
			regalia_menor,
			regalia_media,
			regalia_mayor,
		};
	} catch (error) {
		console.log(error);
		throw new Error("Error al calcular los resúmenes de recursos.");
	}
};

const getInversionSocial = async (distritoId: string): Promise<any> => {
	try {
		// si el distrito es AIO, entonces se muestran todos los proyectos y se filtra por anio 2022 y 2023 y se suma el monto
		const distrito = await getDistritoById(distritoId);

		if (!distrito) {
			return {
				error: "No se encontraron datos para la inversion social",
			};
		}

		if (distrito.nombre === "AIO") {
			const inversionSocialMany = await prisma.inversionSocial.findMany();

			const filter_menor = inversionSocialMany.filter(
				(inversion) => inversion.anio === "2022"
			) as InversionSocial[];

			const filter_mayor = inversionSocialMany.filter(
				(inversion) => inversion.anio === "2023"
			) as InversionSocial[];

			const inversion_menor = filter_menor.reduce(
				(acu, inversion) => acu + inversion.monto,
				0
			);

			const inversion_mayor = filter_mayor.reduce(
				(acu, inversion) => acu + inversion.monto,
				0
			);

			return {
				inversion_menor,
				inversion_mayor,
			};
		}

		const inversionSocial = (await prisma.inversionSocial.findMany({
			where: {
				distrito: {
					id: distritoId,
				},
			},
		})) as InversionSocial[];

		const filter_menor = inversionSocial.filter(
			(inversion) => inversion.anio === "2022"
		) as InversionSocial[];

		const filter_mayor = inversionSocial.filter(
			(inversion) => inversion.anio === "2023"
		) as InversionSocial[];

		const inversion_menor = filter_menor[0].monto;

		const inversion_mayor = filter_mayor[0].monto;

		return {
			inversion_menor,
			inversion_mayor,
		};
	} catch (error) {
		console.log(error);
		throw new Error("Error al calcular los resúmenes de inversión social.");
	}
};

export const getDataResumen = async (req: Request, res: Response) => {
	const { distritoId, periodo } = req.params;
	try {
		const promises = [
			getIdh(distritoId, periodo),
			getBrechas(distritoId, periodo),
			getBrechaFinanciera(distritoId, periodo),
			getProyecto(distritoId, periodo),
			getRecursos(distritoId),
			getInversionSocial(distritoId),
		];
		const [
			idh,
			brechas,
			brechaFinanciera,
			proyectos_cartera,
			recursos,
			inversionSocial,
		] = (await Promise.all(promises)) as [
			IdhResult | null,
			Brecha[],
			BrechaFinancieraResult,
			any,
			Recursos,
			any
		];

		if (!idh || !brechas || !brechaFinanciera) {
			return res.status(404).json({
				message: "No se encontraron datos para la pagina Resumen.",
			});
		}

		res.status(200).json({
			idh: idh.idh,
			ingreso_per_capita: idh.ingreso_per_capita,
			brechas: brechas,
			brecha_financiera: brechaFinanciera.brecha_financiera,
			proyectos_cartera,
			recursos,
			inversionSocial,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error al mostrar los datos de la pagina Resumen.",
		});
	}
};

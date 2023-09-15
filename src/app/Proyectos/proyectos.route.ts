import { Router } from "express";
import * as controller from "./proyectos.controller";

const router = Router();

router.get("/", controller.getAllProyectos);
router.get("/:id", controller.getProyectoById);
router.post("/", controller.createProyecto);
router.post("/many", controller.createManyProyectos);
router.put("/:id", controller.updateProyecto);
router.delete("/:id", controller.deleteProyecto);

export default router;

import { Router } from "express";
import * as Controller from "./recurso.controller";

const router = Router();

router.get("/", Controller.getAllRecursos);
router.get("/:id", Controller.getRecurso);
router.post("/", Controller.createRecurso);
router.post("/many", Controller.createManyRecursos);
router.put("/:id", Controller.updateRecurso);
router.delete("/:id", Controller.deleteRecurso);

export default router;

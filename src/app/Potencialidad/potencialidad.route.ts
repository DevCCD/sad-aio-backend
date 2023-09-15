import { Router } from "express";
import * as Controller from "./potencialidad.controller";

const router = Router();

router.get("/", Controller.getAllPotencialidad);
router.get("/:id", Controller.getPotencialidad);
router.post("/", Controller.createPotencialidad);
router.post("/many", Controller.createManyPotencialidad);
router.put("/:id", Controller.updatePotencialidad);
router.delete("/:id", Controller.deletePotencialidad);

export default router;

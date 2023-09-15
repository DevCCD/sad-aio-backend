import { Router } from "express";
import * as Controller from "./potencial.controller";

const router = Router();

router.get("/", Controller.getAllPotencial);
router.get("/:id", Controller.getPotencial);
router.post("/", Controller.createPotencial);
router.post("/many", Controller.createManyPotencial);
router.put("/:id", Controller.updatePotencial);
router.delete("/:id", Controller.deletePotencial);

export default router;

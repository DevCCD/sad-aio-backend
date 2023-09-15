import { Router } from "express";
import * as Controller from "./peru.controller";

const router = Router();

router.get("/", Controller.getPeru);
router.get("/:id", Controller.getPeruById);
router.post("/", Controller.addPeru);
router.post("/many", Controller.addManyPeru);
router.put("/:id", Controller.updatePeru);
router.delete("/:id", Controller.deletePeru);

export default router;

import { Router } from "express";
import * as Controller from "./brechas.controller";

const router = Router();

router.get("/", Controller.getAllBrechas);
router.get("/:id", Controller.getBrecha);
router.post("/", Controller.createBrecha);
router.post("/many", Controller.createManyBrechas);
router.put("/:id", Controller.updateBrecha);
router.delete("/:id", Controller.deleteBrecha);

export default router;

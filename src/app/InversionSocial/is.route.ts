import { Router } from "express";
import * as Controller from "./is.controller";

const router = Router();

router.get("/", Controller.getAllIs);
router.get("/:id", Controller.getIs);
router.post("/", Controller.createIs);
router.post("/many", Controller.createManyIs);
router.put("/:id", Controller.updateIs);
router.delete("/:id", Controller.deleteIs);

export default router;

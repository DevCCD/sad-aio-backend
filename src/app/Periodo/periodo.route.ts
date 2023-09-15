import { Router } from "express";
import * as Controller from "./periodo.controller";

const router = Router();

router.get("/", Controller.getAll);
router.get("/:id", Controller.getById);
router.post("/", Controller.create);
router.post("/many", Controller.createMany);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.deleteById);

export default router;

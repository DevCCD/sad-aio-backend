import { Router } from "express";
import * as Controller from "./idh.controller";

const router = Router();

router.get("/", Controller.getAll);
router.get("/:id", Controller.getOne);
router.post("/", Controller.create);
router.post("/many", Controller.createMany);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.remove);

export default router;

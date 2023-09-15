import { Router } from "express";
import * as Controller from "./bf.controller";

const router = Router();

router.get("/", Controller.getAllBfs);
router.get("/:id", Controller.getBf);
router.post("/", Controller.createBf);
router.post("/many", Controller.createManyBfs);
router.put("/:id", Controller.updateBf);
router.delete("/:id", Controller.deleteBf);

export default router;

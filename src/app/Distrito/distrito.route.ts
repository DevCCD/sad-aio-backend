import { Router } from "express";
import * as Controller from "./distrito.controller";

const router = Router();

router.get("/", Controller.getAllDistrito);

router.get("/:id", Controller.getDistritoById);

router.post("/", Controller.registerDistrito);

router.post("/many", Controller.registerManyDistrito);

router.put("/:id", Controller.updateDistrito);

router.delete("/:id", Controller.deleteDistrito);

export default router;

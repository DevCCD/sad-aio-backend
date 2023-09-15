import { Router } from "express";
import * as Controller from "./brechas.controller";

const router = Router();

router.post("/:distritoId/:periodoValue/:impacto", Controller.getDataBrechas);

export default router;

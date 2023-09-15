import { Router } from "express";
import * as Controller from "./resumen.controller";

const router = Router();

router.post("/:distritoId/:periodo", Controller.getDataResumen);

export default router;

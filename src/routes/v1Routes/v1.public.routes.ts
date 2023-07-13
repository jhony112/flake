import foobarController from "../../controller/foobar.controller";
import { validateReq } from "../../middlewares/validate.req";
import foobarValidation from "../../validation/foobar.validation";
import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/foobar/:slug", validateReq(foobarValidation.findById), foobarController.findById);
router.get("/foobar", validateReq(foobarValidation.findAll), foobarController.findAll);

export default router;

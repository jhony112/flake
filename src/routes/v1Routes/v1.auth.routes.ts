import express from "express";
import foobarValidation from "../../validation/foobar.validation";
import foobarController from "../../controller/foobar.controller";
import { validateReq } from "../../middlewares/validate.req";

const router = express.Router({ mergeParams: true });

router.post("/foobar", validateReq(foobarValidation.create), foobarController.create);
router.patch("/foobar/:slug", validateReq(foobarValidation.update), foobarController.update);

export default router;

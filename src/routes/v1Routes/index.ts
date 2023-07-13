import express from "express";
import v1AuthRoutes from "./v1.auth.routes";
import v1AdminRoutes from "./v1.admin.routes";
import v1PublicRoutes from "./v1.public.routes";

const router = express.Router({ mergeParams: true });

router.use("/auth", v1AuthRoutes);
router.use("/admin", v1AdminRoutes);
router.use("/", v1PublicRoutes);

export default router;

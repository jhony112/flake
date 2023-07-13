import express from "express";

const router = express.Router({ mergeParams: true });

router.post("/create", (req, res) => {});
router.use("/update", (req, res) => {});

export default router;

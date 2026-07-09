import { Router } from "express";
import { getDbState } from "../config/db.js";
import { sendSuccess } from "../utils/response.js";
import postRoutes from "./postRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  sendSuccess(res, {
    status: "ok",
    uptime: process.uptime(),
    db: getDbState() === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

router.use("/posts", postRoutes);

export default router;

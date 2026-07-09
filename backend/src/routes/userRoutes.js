import { Router } from "express";
import { listUsers } from "../controllers/user/index.js";

const router = Router();

router.get("/", listUsers);

export default router;

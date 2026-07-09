import { Router } from "express";
import { listUserVotes } from "../controllers/vote/index.js";

const router = Router();

router.get("/", listUserVotes);

export default router;

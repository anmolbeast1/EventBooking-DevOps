
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chatWithAI } from "../controllers/chat.controller.js";

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", chatLimiter, chatWithAI);

export default router;

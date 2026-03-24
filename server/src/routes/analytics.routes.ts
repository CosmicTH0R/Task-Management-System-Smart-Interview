import { Router } from "express";
import { protect } from "../middleware/auth";
import { getAnalyticsHandler } from "../controllers/analytics.controller";

const router = Router();

// GET /api/analytics — protected
router.get("/", protect, getAnalyticsHandler);

export default router;

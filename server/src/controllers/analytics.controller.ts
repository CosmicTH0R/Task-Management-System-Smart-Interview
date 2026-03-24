import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { getAnalytics } from "../services/analytics.service";

export const getAnalyticsHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const analytics = await getAnalytics(userId);
  res.json(new ApiResponse(true, "Analytics fetched", analytics));
});

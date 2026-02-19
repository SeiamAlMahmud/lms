import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { analyticsService } from "./analytics.service";

export const analyticsController = {
  global: asyncHandler(async (_req: Request, res: Response) => {
    const data = await analyticsService.getGlobalAnalytics();
    res.status(200).json({ success: true, data });
  }),

  instructorMine: asyncHandler(async (req: Request, res: Response) => {
    const data = await analyticsService.getInstructorAnalytics(req.user!.id);
    res.status(200).json({ success: true, data });
  }),
};

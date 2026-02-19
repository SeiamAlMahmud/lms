import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { systemService } from "./system.service";

export const systemController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await systemService.listSettings();
    res.status(200).json({ success: true, data });
  }),

  upsert: asyncHandler(async (req: Request, res: Response) => {
    const data = await systemService.upsertSetting(req.user!.id, req.body);
    res.status(200).json({ success: true, data });
  }),
};

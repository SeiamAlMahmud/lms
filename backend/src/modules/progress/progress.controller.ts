import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { toSingleParam } from "../../shared/utils/request";
import { progressService } from "./progress.service";

export const progressController = {
  completeLesson: asyncHandler(async (req: Request, res: Response) => {
    const lessonId = toSingleParam(req.params.lessonId, "lessonId");
    const result = await progressService.completeLesson(req.user!, lessonId);
    res.status(200).json({ success: true, data: result });
  }),

  getCourseProgress: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.courseId, "courseId");
    const result = await progressService.getCourseProgress(req.user!, courseId);
    res.status(200).json({ success: true, data: result });
  }),
};

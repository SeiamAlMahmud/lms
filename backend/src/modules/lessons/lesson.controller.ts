import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { toSingleParam } from "../../shared/utils/request";
import { lessonService } from "./lesson.service";

export const lessonController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.courseId, "courseId");
    const lesson = await lessonService.create(req.user!, courseId, req.body);
    res.status(201).json({ success: true, data: lesson });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const lessonId = toSingleParam(req.params.lessonId, "lessonId");
    const lesson = await lessonService.update(req.user!, lessonId, req.body);
    res.status(200).json({ success: true, data: lesson });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const lessonId = toSingleParam(req.params.lessonId, "lessonId");
    await lessonService.remove(req.user!, lessonId);
    res.status(200).json({ success: true, message: "Lesson deleted" });
  }),

  listByCourse: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.courseId, "courseId");
    const lessons = await lessonService.listByCourse(courseId, req.user);
    res.status(200).json({ success: true, data: lessons });
  }),
};

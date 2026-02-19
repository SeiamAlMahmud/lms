import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { toSingleParam } from "../../shared/utils/request";
import { courseService } from "./course.service";

export const courseController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const course = await courseService.create(req.user!, req.body);
    res.status(201).json({ success: true, data: course });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.id, "id");
    const course = await courseService.getById(courseId, req.user);
    res.status(200).json({ success: true, data: course });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.id, "id");
    const course = await courseService.update(courseId, req.body);
    res.status(200).json({ success: true, data: course });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.id, "id");
    const course = await courseService.updateStatus(req.user!, courseId, req.body.status);
    res.status(200).json({ success: true, data: course });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.id, "id");
    const course = await courseService.softDelete(courseId);
    res.status(200).json({ success: true, data: course });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await courseService.list(req.query as any);
    res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
  }),
};

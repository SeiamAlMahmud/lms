import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { toSingleParam } from "../../shared/utils/request";
import { enrollmentService } from "./enrollment.service";

export const enrollmentController = {
  enroll: asyncHandler(async (req: Request, res: Response) => {
    const enrollment = await enrollmentService.enroll(req.user!, req.body);
    res.status(201).json({ success: true, data: enrollment });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const enrollmentId = toSingleParam(req.params.enrollmentId, "enrollmentId");
    const enrollment = await enrollmentService.updateMyEnrollmentStatus(
      req.user!,
      enrollmentId,
      req.body.status,
    );
    res.status(200).json({ success: true, data: enrollment });
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    const result = await enrollmentService.listMyEnrollments(req.user!.id, req.query as any);
    res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
  }),

  listByCourse: asyncHandler(async (req: Request, res: Response) => {
    const courseId = toSingleParam(req.params.courseId, "courseId");
    const result = await enrollmentService.listCourseEnrollments(req.user!, courseId, req.query as any);
    res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
  }),
};

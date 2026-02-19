import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { lessonController } from "./lesson.controller";
import {
  createLessonSchema,
  lessonCourseParamSchema,
  lessonIdParamSchema,
  updateLessonSchema,
} from "./lesson.dto";

const router = Router();

router.get("/course/:courseId", validateRequest(lessonCourseParamSchema), lessonController.listByCourse);

router.post(
  "/course/:courseId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  validateRequest(createLessonSchema),
  lessonController.create,
);

router.patch(
  "/:lessonId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  validateRequest(updateLessonSchema),
  lessonController.update,
);

router.delete(
  "/:lessonId",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  validateRequest(lessonIdParamSchema),
  lessonController.remove,
);

export default router;

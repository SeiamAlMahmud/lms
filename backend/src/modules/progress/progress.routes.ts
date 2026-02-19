import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { progressController } from "./progress.controller";
import { completeLessonSchema, courseProgressSchema } from "./progress.dto";

const router = Router();

router.use(authenticate, authorize(UserRole.STUDENT));

router.post("/lessons/:lessonId/complete", validateRequest(completeLessonSchema), progressController.completeLesson);
router.get("/courses/:courseId", validateRequest(courseProgressSchema), progressController.getCourseProgress);

export default router;

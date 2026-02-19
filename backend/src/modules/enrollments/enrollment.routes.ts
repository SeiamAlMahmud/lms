import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize, forbidRoles } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { enrollmentController } from "./enrollment.controller";
import {
  courseEnrollmentParamSchema,
  enrollSchema,
  listEnrollmentSchema,
  updateEnrollmentStatusSchema,
} from "./enrollment.dto";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  authorize(UserRole.STUDENT, UserRole.SUPER_ADMIN),
  forbidRoles(UserRole.SUPER_ADMIN),
  validateRequest(enrollSchema),
  enrollmentController.enroll,
);

router.patch(
  "/:enrollmentId/status",
  authorize(UserRole.STUDENT),
  validateRequest(updateEnrollmentStatusSchema),
  enrollmentController.updateStatus,
);

router.get("/me", authorize(UserRole.STUDENT), validateRequest(listEnrollmentSchema), enrollmentController.listMine);

router.get(
  "/course/:courseId",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.INSTRUCTOR),
  validateRequest(courseEnrollmentParamSchema),
  enrollmentController.listByCourse,
);

export default router;

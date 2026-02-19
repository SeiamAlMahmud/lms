import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize, forbidRoles } from "../../shared/middleware/auth";
import { requireCourseOwnership } from "../../shared/middleware/ownership";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { courseController } from "./course.controller";
import {
  courseIdParamSchema,
  createCourseSchema,
  listCourseSchema,
  updateCourseSchema,
  updateCourseStatusSchema,
} from "./course.dto";

const router = Router();

router.get("/", validateRequest(listCourseSchema), courseController.list);
router.get("/:id", validateRequest(courseIdParamSchema), courseController.getById);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  forbidRoles(UserRole.SUPER_ADMIN),
  validateRequest(createCourseSchema),
  courseController.create,
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  requireCourseOwnership,
  validateRequest(updateCourseSchema),
  courseController.update,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.INSTRUCTOR),
  requireCourseOwnership,
  validateRequest(updateCourseStatusSchema),
  courseController.updateStatus,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.SUPER_ADMIN),
  requireCourseOwnership,
  validateRequest(courseIdParamSchema),
  courseController.remove,
);

export default router;

import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { analyticsController } from "./analytics.controller";

const router = Router();

router.get("/global", authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), analyticsController.global);
router.get("/instructor/me", authenticate, authorize(UserRole.INSTRUCTOR), analyticsController.instructorMine);

export default router;

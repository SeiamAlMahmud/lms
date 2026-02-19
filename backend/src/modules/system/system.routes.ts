import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { systemController } from "./system.controller";
import { upsertSettingSchema } from "./system.dto";

const router = Router();

router.use(authenticate, authorize(UserRole.SUPER_ADMIN));

router.get("/settings", systemController.list);
router.put("/settings", validateRequest(upsertSettingSchema), systemController.upsert);

export default router;

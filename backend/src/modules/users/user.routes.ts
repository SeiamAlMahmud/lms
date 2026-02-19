import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { userController } from "./user.controller";
import { createAdminSchema, listUsersSchema, updateUserStatusSchema } from "./user.dto";

const router = Router();

router.use(authenticate);

router.get("/", authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), validateRequest(listUsersSchema), userController.listUsers);
router.post("/admins", authorize(UserRole.SUPER_ADMIN), validateRequest(createAdminSchema), userController.createAdmin);
router.patch(
  "/:id/status",
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updateUserStatusSchema),
  userController.updateStatus,
);

export default router;

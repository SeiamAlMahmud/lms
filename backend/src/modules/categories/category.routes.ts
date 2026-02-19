import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authenticate, authorize } from "../../shared/middleware/auth";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { categoryController } from "./category.controller";
import { createCategorySchema, listCategorySchema, updateCategorySchema } from "./category.dto";

const router = Router();

router.get("/", validateRequest(listCategorySchema), categoryController.list);
router.post(
  "/",
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createCategorySchema),
  categoryController.create,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updateCategorySchema),
  categoryController.update,
);

export default router;

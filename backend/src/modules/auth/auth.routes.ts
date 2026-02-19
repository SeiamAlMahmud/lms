import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import { authRateLimiter } from "../../shared/middleware/rateLimit";
import { validateRequest } from "../../shared/middleware/validateRequest";
import { authController } from "./auth.controller";
import {
  bootstrapSuperAdminSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
} from "./auth.dto";

const router = Router();

router.post(
  "/bootstrap-super-admin",
  authRateLimiter,
  validateRequest(bootstrapSuperAdminSchema),
  authController.bootstrapSuperAdmin,
);
router.post("/register", authRateLimiter, validateRequest(registerSchema), authController.register);
router.post("/login", authRateLimiter, validateRequest(loginSchema), authController.login);
router.post("/refresh", authRateLimiter, validateRequest(refreshSchema), authController.refresh);
router.post("/logout", authenticate, authController.logout);

export default router;

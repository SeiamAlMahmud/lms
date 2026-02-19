import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import categoryRoutes from "../modules/categories/category.routes";
import courseRoutes from "../modules/courses/course.routes";
import lessonRoutes from "../modules/lessons/lesson.routes";
import enrollmentRoutes from "../modules/enrollments/enrollment.routes";
import progressRoutes from "../modules/progress/progress.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import systemRoutes from "../modules/system/system.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/courses", courseRoutes);
router.use("/lessons", lessonRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/progress", progressRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/system", systemRoutes);

export default router;

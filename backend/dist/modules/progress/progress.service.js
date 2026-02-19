"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const progress_repository_1 = require("./progress.repository");
exports.progressService = {
    completeLesson: async (user, lessonId) => {
        if (user.role !== client_1.UserRole.STUDENT) {
            throw new AppError_1.AppError("Only students can complete lessons", 403);
        }
        const lesson = await progress_repository_1.progressRepository.findLessonById(lessonId);
        if (!lesson || lesson.course.isDeleted) {
            throw new AppError_1.AppError("Lesson not found", 404);
        }
        const enrollment = await progress_repository_1.progressRepository.findEnrollment(user.id, lesson.courseId);
        if (!enrollment || enrollment.status === client_1.EnrollmentStatus.DROPPED) {
            throw new AppError_1.AppError("You are not actively enrolled in this course", 403);
        }
        await progress_repository_1.progressRepository.markLessonComplete(user.id, lessonId);
        const stats = await progress_repository_1.progressRepository.getProgressStats(user.id, lesson.courseId);
        const progressPercentage = stats.totalLessons === 0 ? 0 : Number(((stats.completedLessons / stats.totalLessons) * 100).toFixed(2));
        if (progressPercentage >= 100 && enrollment.status !== client_1.EnrollmentStatus.COMPLETED) {
            await progress_repository_1.progressRepository.completeEnrollment(enrollment.id);
        }
        return {
            courseId: lesson.courseId,
            completedLessons: stats.completedLessons,
            totalLessons: stats.totalLessons,
            progressPercentage,
            enrollmentStatus: progressPercentage >= 100 ? client_1.EnrollmentStatus.COMPLETED : enrollment.status,
        };
    },
    getCourseProgress: async (user, courseId) => {
        if (user.role !== client_1.UserRole.STUDENT) {
            throw new AppError_1.AppError("Only students can view course progress", 403);
        }
        const enrollment = await progress_repository_1.progressRepository.findEnrollment(user.id, courseId);
        if (!enrollment) {
            throw new AppError_1.AppError("Enrollment not found", 404);
        }
        const stats = await progress_repository_1.progressRepository.getProgressStats(user.id, courseId);
        const progressPercentage = stats.totalLessons === 0 ? 0 : Number(((stats.completedLessons / stats.totalLessons) * 100).toFixed(2));
        return {
            courseId,
            status: enrollment.status,
            completedLessons: stats.completedLessons,
            totalLessons: stats.totalLessons,
            progressPercentage,
        };
    },
};

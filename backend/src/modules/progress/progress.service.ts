import { EnrollmentStatus, UserRole } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { progressRepository } from "./progress.repository";

export const progressService = {
  completeLesson: async (user: { id: string; role: UserRole }, lessonId: string) => {
    if (user.role !== UserRole.STUDENT) {
      throw new AppError("Only students can complete lessons", 403);
    }

    const lesson = await progressRepository.findLessonById(lessonId);
    if (!lesson || lesson.course.isDeleted) {
      throw new AppError("Lesson not found", 404);
    }

    const enrollment = await progressRepository.findEnrollment(user.id, lesson.courseId);
    if (!enrollment || enrollment.status === EnrollmentStatus.DROPPED) {
      throw new AppError("You are not actively enrolled in this course", 403);
    }

    await progressRepository.markLessonComplete(user.id, lessonId);
    const stats = await progressRepository.getProgressStats(user.id, lesson.courseId);

    const progressPercentage =
      stats.totalLessons === 0 ? 0 : Number(((stats.completedLessons / stats.totalLessons) * 100).toFixed(2));

    if (progressPercentage >= 100 && enrollment.status !== EnrollmentStatus.COMPLETED) {
      await progressRepository.completeEnrollment(enrollment.id);
    }

    return {
      courseId: lesson.courseId,
      completedLessons: stats.completedLessons,
      totalLessons: stats.totalLessons,
      progressPercentage,
      enrollmentStatus: progressPercentage >= 100 ? EnrollmentStatus.COMPLETED : enrollment.status,
    };
  },

  getCourseProgress: async (user: { id: string; role: UserRole }, courseId: string) => {
    if (user.role !== UserRole.STUDENT) {
      throw new AppError("Only students can view course progress", 403);
    }

    const enrollment = await progressRepository.findEnrollment(user.id, courseId);
    if (!enrollment) {
      throw new AppError("Enrollment not found", 404);
    }

    const stats = await progressRepository.getProgressStats(user.id, courseId);

    const progressPercentage =
      stats.totalLessons === 0 ? 0 : Number(((stats.completedLessons / stats.totalLessons) * 100).toFixed(2));

    return {
      courseId,
      status: enrollment.status,
      completedLessons: stats.completedLessons,
      totalLessons: stats.totalLessons,
      progressPercentage,
    };
  },
};

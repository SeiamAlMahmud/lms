import { EnrollmentStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const progressRepository = {
  findLessonById: (lessonId: string) =>
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    }),

  findEnrollment: (studentId: string, courseId: string) =>
    prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    }),

  markLessonComplete: (studentId: string, lessonId: string) =>
    prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        studentId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
      },
    }),

  getProgressStats: async (studentId: string, courseId: string) => {
    const [totalLessons, completedLessons] = await Promise.all([
      prisma.lesson.count({ where: { courseId } }),
      prisma.lessonProgress.count({
        where: {
          studentId,
          isCompleted: true,
          lesson: {
            courseId,
          },
        },
      }),
    ]);

    return { totalLessons, completedLessons };
  },

  completeEnrollment: (enrollmentId: string) =>
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: EnrollmentStatus.COMPLETED,
        completedAt: new Date(),
      },
    }),
};

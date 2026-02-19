"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
exports.progressRepository = {
    findLessonById: (lessonId) => prisma_1.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
    }),
    findEnrollment: (studentId, courseId) => prisma_1.prisma.enrollment.findUnique({
        where: {
            studentId_courseId: { studentId, courseId },
        },
    }),
    markLessonComplete: (studentId, lessonId) => prisma_1.prisma.lessonProgress.upsert({
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
    getProgressStats: async (studentId, courseId) => {
        const [totalLessons, completedLessons] = await Promise.all([
            prisma_1.prisma.lesson.count({ where: { courseId } }),
            prisma_1.prisma.lessonProgress.count({
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
    completeEnrollment: (enrollmentId) => prisma_1.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
            status: client_1.EnrollmentStatus.COMPLETED,
            completedAt: new Date(),
        },
    }),
};

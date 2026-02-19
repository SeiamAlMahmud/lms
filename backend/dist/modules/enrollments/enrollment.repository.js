"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
exports.enrollmentRepository = {
    findCourseById: (courseId) => prisma_1.prisma.course.findUnique({ where: { id: courseId } }),
    findEnrollment: (studentId, courseId) => prisma_1.prisma.enrollment.findUnique({
        where: {
            studentId_courseId: { studentId, courseId },
        },
    }),
    createEnrollmentTx: (studentId, courseId, paidAmount) => prisma_1.prisma.$transaction(async (tx) => {
        const enrollment = await tx.enrollment.create({
            data: {
                studentId,
                courseId,
                paidAmount,
                status: client_1.EnrollmentStatus.ACTIVE,
            },
        });
        return enrollment;
    }),
    updateEnrollmentStatus: (enrollmentId, status) => prisma_1.prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
            status,
            droppedAt: status === client_1.EnrollmentStatus.DROPPED ? new Date() : null,
            completedAt: status === client_1.EnrollmentStatus.COMPLETED ? new Date() : null,
        },
    }),
    findEnrollmentById: (enrollmentId) => prisma_1.prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        include: {
            course: true,
        },
    }),
    listStudentEnrollments: async (query) => {
        const rows = await prisma_1.prisma.enrollment.findMany({
            where: {
                studentId: query.studentId,
                ...(query.status ? { status: query.status } : {}),
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        thumbnailUrl: true,
                    },
                },
            },
            take: query.limit + 1,
            ...(query.cursor
                ? {
                    skip: 1,
                    cursor: { id: query.cursor },
                }
                : {}),
            orderBy: { enrolledAt: "desc" },
        });
        const hasNext = rows.length > query.limit;
        const data = hasNext ? rows.slice(0, -1) : rows;
        return {
            data,
            nextCursor: hasNext ? data[data.length - 1]?.id : null,
        };
    },
    listCourseEnrollments: async (query) => {
        const rows = await prisma_1.prisma.enrollment.findMany({
            where: {
                courseId: query.courseId,
            },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        status: true,
                    },
                },
            },
            take: query.limit + 1,
            ...(query.cursor
                ? {
                    skip: 1,
                    cursor: { id: query.cursor },
                }
                : {}),
            orderBy: { enrolledAt: "desc" },
        });
        const hasNext = rows.length > query.limit;
        const data = hasNext ? rows.slice(0, -1) : rows;
        return {
            data,
            nextCursor: hasNext ? data[data.length - 1]?.id : null,
        };
    },
};

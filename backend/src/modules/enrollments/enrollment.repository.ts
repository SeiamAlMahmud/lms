import { EnrollmentStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const enrollmentRepository = {
  findCourseById: (courseId: string) => prisma.course.findUnique({ where: { id: courseId } }),
  findEnrollment: (studentId: string, courseId: string) =>
    prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    }),

  createEnrollmentTx: (studentId: string, courseId: string, paidAmount: number) =>
    prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.create({
        data: {
          studentId,
          courseId,
          paidAmount,
          status: EnrollmentStatus.ACTIVE,
        },
      });

      return enrollment;
    }),

  updateEnrollmentStatus: (enrollmentId: string, status: EnrollmentStatus) =>
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status,
        droppedAt: status === EnrollmentStatus.DROPPED ? new Date() : null,
        completedAt: status === EnrollmentStatus.COMPLETED ? new Date() : null,
      },
    }),

  findEnrollmentById: (enrollmentId: string) =>
    prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
      },
    }),

  listStudentEnrollments: async (query: {
    studentId: string;
    status?: EnrollmentStatus;
    cursor?: string;
    limit: number;
  }) => {
    const rows = await prisma.enrollment.findMany({
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

  listCourseEnrollments: async (query: { courseId: string; cursor?: string; limit: number }) => {
    const rows = await prisma.enrollment.findMany({
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

import { CourseStatus, EnrollmentStatus, UserRole } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { enrollmentRepository } from "./enrollment.repository";

export const enrollmentService = {
  enroll: async (student: { id: string; role: UserRole }, payload: { courseId: string }) => {
    if (student.role !== UserRole.STUDENT) {
      throw new AppError("Only students can enroll", 403);
    }

    const course = await enrollmentRepository.findCourseById(payload.courseId);
    if (!course || course.isDeleted || course.status !== CourseStatus.PUBLISHED) {
      throw new AppError("Course is not available for enrollment", 400);
    }

    const existing = await enrollmentRepository.findEnrollment(student.id, payload.courseId);
    if (existing) {
      throw new AppError("Already enrolled in this course", 409);
    }

    return enrollmentRepository.createEnrollmentTx(
      student.id,
      payload.courseId,
      course.isFree ? 0 : course.price,
    );
  },

  updateMyEnrollmentStatus: async (
    user: { id: string; role: UserRole },
    enrollmentId: string,
    status: EnrollmentStatus,
  ) => {
    if (user.role !== UserRole.STUDENT) {
      throw new AppError("Only students can update own enrollment status", 403);
    }

    if (status !== EnrollmentStatus.ACTIVE && status !== EnrollmentStatus.DROPPED) {
      throw new AppError("Students can only toggle active/dropped status", 400);
    }

    const enrollment = await enrollmentRepository.findEnrollmentById(enrollmentId);
    if (!enrollment || enrollment.studentId !== user.id) {
      throw new AppError("Enrollment not found", 404);
    }

    return enrollmentRepository.updateEnrollmentStatus(enrollmentId, status);
  },

  listMyEnrollments: async (userId: string, query: { status?: EnrollmentStatus; cursor?: string; limit: number }) => {
    return enrollmentRepository.listStudentEnrollments({
      studentId: userId,
      ...query,
    });
  },

  listCourseEnrollments: async (
    actor: { id: string; role: UserRole },
    courseId: string,
    query: { cursor?: string; limit: number },
  ) => {
    const course = await enrollmentRepository.findCourseById(courseId);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    const isAdmin = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN;
    const isOwner = course.instructorId === actor.id;

    if (!isAdmin && !isOwner) {
      throw new AppError("Forbidden", 403);
    }

    return enrollmentRepository.listCourseEnrollments({
      courseId,
      ...query,
    });
  },
};

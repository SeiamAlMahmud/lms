"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const enrollment_repository_1 = require("./enrollment.repository");
exports.enrollmentService = {
    enroll: async (student, payload) => {
        if (student.role !== client_1.UserRole.STUDENT) {
            throw new AppError_1.AppError("Only students can enroll", 403);
        }
        const course = await enrollment_repository_1.enrollmentRepository.findCourseById(payload.courseId);
        if (!course || course.isDeleted || course.status !== client_1.CourseStatus.PUBLISHED) {
            throw new AppError_1.AppError("Course is not available for enrollment", 400);
        }
        const existing = await enrollment_repository_1.enrollmentRepository.findEnrollment(student.id, payload.courseId);
        if (existing) {
            throw new AppError_1.AppError("Already enrolled in this course", 409);
        }
        return enrollment_repository_1.enrollmentRepository.createEnrollmentTx(student.id, payload.courseId, course.isFree ? 0 : course.price);
    },
    updateMyEnrollmentStatus: async (user, enrollmentId, status) => {
        if (user.role !== client_1.UserRole.STUDENT) {
            throw new AppError_1.AppError("Only students can update own enrollment status", 403);
        }
        if (status !== client_1.EnrollmentStatus.ACTIVE && status !== client_1.EnrollmentStatus.DROPPED) {
            throw new AppError_1.AppError("Students can only toggle active/dropped status", 400);
        }
        const enrollment = await enrollment_repository_1.enrollmentRepository.findEnrollmentById(enrollmentId);
        if (!enrollment || enrollment.studentId !== user.id) {
            throw new AppError_1.AppError("Enrollment not found", 404);
        }
        return enrollment_repository_1.enrollmentRepository.updateEnrollmentStatus(enrollmentId, status);
    },
    listMyEnrollments: async (userId, query) => {
        return enrollment_repository_1.enrollmentRepository.listStudentEnrollments({
            studentId: userId,
            ...query,
        });
    },
    listCourseEnrollments: async (actor, courseId, query) => {
        const course = await enrollment_repository_1.enrollmentRepository.findCourseById(courseId);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        const isAdmin = actor.role === client_1.UserRole.ADMIN || actor.role === client_1.UserRole.SUPER_ADMIN;
        const isOwner = course.instructorId === actor.id;
        if (!isAdmin && !isOwner) {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        return enrollment_repository_1.enrollmentRepository.listCourseEnrollments({
            courseId,
            ...query,
        });
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../shared/errors/AppError");
const course_repository_1 = require("./course.repository");
exports.courseService = {
    create: async (actor, payload) => {
        if (actor.role === client_1.UserRole.SUPER_ADMIN) {
            throw new AppError_1.AppError("Super admin cannot create courses", 403);
        }
        const instructorId = actor.role === client_1.UserRole.ADMIN ? payload.instructorId ?? actor.id : actor.id;
        if (!payload.isFree && payload.price <= 0) {
            throw new AppError_1.AppError("Paid course must have a positive price", 400);
        }
        return course_repository_1.courseRepository.create({
            title: payload.title,
            description: payload.description,
            thumbnailUrl: payload.thumbnailUrl,
            category: payload.categoryId ? { connect: { id: payload.categoryId } } : undefined,
            isFree: payload.isFree,
            price: payload.isFree ? 0 : payload.price,
            instructor: { connect: { id: instructorId } },
            status: client_1.CourseStatus.DRAFT,
        });
    },
    getById: async (id, requester) => {
        const course = await course_repository_1.courseRepository.findById(id);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        if (course.status !== client_1.CourseStatus.PUBLISHED && requester?.role === client_1.UserRole.STUDENT) {
            const enrollment = await prisma_1.prisma.enrollment.findUnique({
                where: {
                    studentId_courseId: {
                        studentId: requester.id,
                        courseId: course.id,
                    },
                },
            });
            if (!enrollment) {
                throw new AppError_1.AppError("Course is not publicly available", 403);
            }
        }
        return course;
    },
    update: async (id, payload) => {
        const existing = await course_repository_1.courseRepository.findById(id);
        if (!existing || existing.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        const isFree = payload.isFree ?? existing.isFree;
        const price = payload.price ?? existing.price;
        if (!isFree && price <= 0) {
            throw new AppError_1.AppError("Paid course must have a positive price", 400);
        }
        return course_repository_1.courseRepository.update(id, {
            title: payload.title,
            description: payload.description,
            thumbnailUrl: payload.thumbnailUrl,
            category: payload.categoryId
                ? {
                    connect: { id: payload.categoryId },
                }
                : payload.categoryId === ""
                    ? { disconnect: true }
                    : undefined,
            isFree,
            price: isFree ? 0 : price,
        });
    },
    updateStatus: async (actor, id, status) => {
        const course = await course_repository_1.courseRepository.findById(id);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        const isAdmin = actor.role === client_1.UserRole.ADMIN || actor.role === client_1.UserRole.SUPER_ADMIN;
        const isOwner = course.instructorId === actor.id;
        if (!isAdmin && !isOwner) {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        if (actor.role === client_1.UserRole.INSTRUCTOR && status === client_1.CourseStatus.ARCHIVED && !isOwner) {
            throw new AppError_1.AppError("Forbidden", 403);
        }
        return course_repository_1.courseRepository.update(id, { status });
    },
    softDelete: async (id) => {
        const course = await course_repository_1.courseRepository.findById(id);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        return course_repository_1.courseRepository.update(id, {
            isDeleted: true,
            deletedAt: new Date(),
            status: client_1.CourseStatus.ARCHIVED,
        });
    },
    list: (query) => course_repository_1.courseRepository.list(query),
};

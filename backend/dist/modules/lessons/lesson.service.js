"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../shared/errors/AppError");
const lesson_repository_1 = require("./lesson.repository");
const assertCoursePermission = (actor, instructorId) => {
    const isAdmin = actor.role === client_1.UserRole.ADMIN || actor.role === client_1.UserRole.SUPER_ADMIN;
    const isOwner = instructorId === actor.id;
    if (!isAdmin && !isOwner) {
        throw new AppError_1.AppError("Forbidden", 403);
    }
};
exports.lessonService = {
    create: async (actor, courseId, payload) => {
        const course = await lesson_repository_1.lessonRepository.findCourseById(courseId);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        assertCoursePermission(actor, course.instructorId);
        return lesson_repository_1.lessonRepository.create({
            title: payload.title,
            type: payload.type,
            content: payload.content,
            videoUrl: payload.videoUrl,
            order: payload.order,
            isPreview: payload.isPreview,
            course: { connect: { id: courseId } },
        });
    },
    update: async (actor, lessonId, payload) => {
        const lesson = await lesson_repository_1.lessonRepository.findById(lessonId);
        if (!lesson || lesson.course.isDeleted) {
            throw new AppError_1.AppError("Lesson not found", 404);
        }
        assertCoursePermission(actor, lesson.course.instructorId);
        return lesson_repository_1.lessonRepository.update(lessonId, payload);
    },
    remove: async (actor, lessonId) => {
        const lesson = await lesson_repository_1.lessonRepository.findById(lessonId);
        if (!lesson || lesson.course.isDeleted) {
            throw new AppError_1.AppError("Lesson not found", 404);
        }
        assertCoursePermission(actor, lesson.course.instructorId);
        return lesson_repository_1.lessonRepository.remove(lessonId);
    },
    listByCourse: async (courseId, actor) => {
        const course = await lesson_repository_1.lessonRepository.findCourseById(courseId);
        if (!course || course.isDeleted) {
            throw new AppError_1.AppError("Course not found", 404);
        }
        const lessons = await lesson_repository_1.lessonRepository.listByCourse(courseId);
        if (!actor) {
            return lessons.filter((lesson) => lesson.isPreview);
        }
        if (actor.role === client_1.UserRole.ADMIN || actor.role === client_1.UserRole.SUPER_ADMIN || actor.id === course.instructorId) {
            return lessons;
        }
        if (actor.role === client_1.UserRole.STUDENT) {
            const enrollment = await prisma_1.prisma.enrollment.findUnique({
                where: {
                    studentId_courseId: {
                        studentId: actor.id,
                        courseId,
                    },
                },
            });
            if (enrollment) {
                return lessons;
            }
            return lessons.filter((lesson) => lesson.isPreview);
        }
        return lessons.filter((lesson) => lesson.isPreview);
    },
};

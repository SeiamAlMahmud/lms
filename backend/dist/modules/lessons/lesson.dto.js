"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonIdParamSchema = exports.lessonCourseParamSchema = exports.updateLessonSchema = exports.createLessonSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2),
        type: zod_1.z.nativeEnum(client_1.LessonType),
        content: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().url().optional(),
        order: zod_1.z.number().int().positive(),
        isPreview: zod_1.z.boolean().default(false),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        courseId: zod_1.z.string().min(1),
    }),
});
exports.updateLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(2).optional(),
        type: zod_1.z.nativeEnum(client_1.LessonType).optional(),
        content: zod_1.z.string().optional(),
        videoUrl: zod_1.z.string().url().optional(),
        order: zod_1.z.number().int().positive().optional(),
        isPreview: zod_1.z.boolean().optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        lessonId: zod_1.z.string().min(1),
    }),
});
exports.lessonCourseParamSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        courseId: zod_1.z.string().min(1),
    }),
});
exports.lessonIdParamSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        lessonId: zod_1.z.string().min(1),
    }),
});

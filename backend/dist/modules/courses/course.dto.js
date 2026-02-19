"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdParamSchema = exports.listCourseSchema = exports.updateCourseStatusSchema = exports.updateCourseSchema = exports.createCourseSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3),
        description: zod_1.z.string().optional(),
        thumbnailUrl: zod_1.z.string().url().optional(),
        categoryId: zod_1.z.string().optional(),
        isFree: zod_1.z.boolean().default(true),
        price: zod_1.z.number().min(0).default(0),
        instructorId: zod_1.z.string().optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.updateCourseSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().optional(),
        thumbnailUrl: zod_1.z.string().url().optional(),
        categoryId: zod_1.z.string().optional(),
        isFree: zod_1.z.boolean().optional(),
        price: zod_1.z.number().min(0).optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
exports.updateCourseStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.CourseStatus),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
exports.listCourseSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
        search: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(client_1.CourseStatus).optional(),
        categoryId: zod_1.z.string().optional(),
        instructorId: zod_1.z.string().optional(),
        isFree: zod_1.z.coerce.boolean().optional(),
        sortBy: zod_1.z.enum(["createdAt", "title", "price"]).default("createdAt"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    }),
});
exports.courseIdParamSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});

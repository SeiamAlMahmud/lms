"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseEnrollmentParamSchema = exports.listEnrollmentSchema = exports.updateEnrollmentStatusSchema = exports.enrollSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.enrollSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.string().min(1),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.updateEnrollmentStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.EnrollmentStatus),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        enrollmentId: zod_1.z.string().min(1),
    }),
});
exports.listEnrollmentSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.EnrollmentStatus).optional(),
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    }),
});
exports.courseEnrollmentParamSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    }),
    params: zod_1.z.object({
        courseId: zod_1.z.string().min(1),
    }),
});

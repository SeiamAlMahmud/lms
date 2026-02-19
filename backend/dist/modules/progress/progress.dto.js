"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseProgressSchema = exports.completeLessonSchema = void 0;
const zod_1 = require("zod");
exports.completeLessonSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        lessonId: zod_1.z.string().min(1),
    }),
});
exports.courseProgressSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        courseId: zod_1.z.string().min(1),
    }),
});

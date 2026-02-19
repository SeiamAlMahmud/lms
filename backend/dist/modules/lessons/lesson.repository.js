"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.lessonRepository = {
    findCourseById: (courseId) => prisma_1.prisma.course.findUnique({ where: { id: courseId } }),
    create: (data) => prisma_1.prisma.lesson.create({ data }),
    findById: (lessonId) => prisma_1.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
    }),
    update: (lessonId, data) => prisma_1.prisma.lesson.update({ where: { id: lessonId }, data }),
    remove: (lessonId) => prisma_1.prisma.lesson.delete({ where: { id: lessonId } }),
    listByCourse: (courseId) => prisma_1.prisma.lesson.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
    }),
};

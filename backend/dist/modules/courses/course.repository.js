"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.courseRepository = {
    create: (data) => prisma_1.prisma.course.create({ data }),
    findById: (id) => prisma_1.prisma.course.findUnique({
        where: { id },
        include: {
            instructor: {
                select: { id: true, fullName: true, email: true },
            },
            category: true,
            _count: {
                select: { lessons: true, enrollments: true },
            },
        },
    }),
    update: (id, data) => prisma_1.prisma.course.update({ where: { id }, data }),
    list: async (query) => {
        const where = {
            isDeleted: false,
            ...(query.search ? { title: { contains: query.search } } : {}),
            ...(query.status ? { status: query.status } : {}),
            ...(query.categoryId ? { categoryId: query.categoryId } : {}),
            ...(query.instructorId ? { instructorId: query.instructorId } : {}),
            ...(query.isFree === undefined ? {} : { isFree: query.isFree }),
        };
        const orderBy = {
            [query.sortBy]: query.sortOrder,
        };
        const rows = await prisma_1.prisma.course.findMany({
            where,
            orderBy,
            take: query.limit + 1,
            ...(query.cursor
                ? {
                    skip: 1,
                    cursor: { id: query.cursor },
                }
                : {}),
            include: {
                instructor: {
                    select: { id: true, fullName: true },
                },
                category: {
                    select: { id: true, name: true, slug: true },
                },
                _count: {
                    select: { lessons: true, enrollments: true },
                },
            },
        });
        const hasNext = rows.length > query.limit;
        const data = hasNext ? rows.slice(0, -1) : rows;
        return {
            data,
            nextCursor: hasNext ? data[data.length - 1]?.id : null,
        };
    },
};

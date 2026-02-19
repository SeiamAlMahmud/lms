"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.categoryRepository = {
    create: (data) => prisma_1.prisma.category.create({ data }),
    update: (id, data) => prisma_1.prisma.category.update({ where: { id }, data }),
    findByName: (name) => prisma_1.prisma.category.findUnique({ where: { name } }),
    findById: (id) => prisma_1.prisma.category.findUnique({ where: { id } }),
    list: async (filters) => {
        const rows = await prisma_1.prisma.category.findMany({
            where: {
                ...(filters.isActive === undefined ? {} : { isActive: filters.isActive }),
            },
            take: filters.limit + 1,
            ...(filters.cursor
                ? {
                    skip: 1,
                    cursor: { id: filters.cursor },
                }
                : {}),
            orderBy: { createdAt: "desc" },
        });
        const hasNext = rows.length > filters.limit;
        const data = hasNext ? rows.slice(0, -1) : rows;
        return {
            data,
            nextCursor: hasNext ? data[data.length - 1]?.id : null,
        };
    },
};

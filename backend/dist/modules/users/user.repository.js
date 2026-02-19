"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
exports.userRepository = {
    findByEmail: (email) => prisma_1.prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma_1.prisma.user.findUnique({ where: { id } }),
    createAdmin: (data) => prisma_1.prisma.user.create({
        data: {
            ...data,
            role: client_1.UserRole.ADMIN,
        },
    }),
    updateStatus: (id, status) => prisma_1.prisma.user.update({ where: { id }, data: { status } }),
    listUsers: async (filters) => {
        const where = {
            role: filters.role,
            status: filters.status,
        };
        const users = await prisma_1.prisma.user.findMany({
            where,
            take: filters.limit + 1,
            ...(filters.cursor
                ? {
                    skip: 1,
                    cursor: { id: filters.cursor },
                }
                : {}),
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
        const hasNext = users.length > filters.limit;
        const data = hasNext ? users.slice(0, -1) : users;
        return {
            data,
            nextCursor: hasNext ? data[data.length - 1]?.id : null,
        };
    },
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = require("../../config/prisma");
exports.authRepository = {
    findByEmail: (email) => prisma_1.prisma.user.findUnique({ where: { email } }),
    findById: (id) => prisma_1.prisma.user.findUnique({ where: { id } }),
    countByRole: (role) => prisma_1.prisma.user.count({ where: { role } }),
    createUser: (data) => prisma_1.prisma.user.create({ data }),
    updateRefreshTokenHash: (id, refreshTokenHash) => prisma_1.prisma.user.update({
        where: { id },
        data: { refreshTokenHash },
    }),
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemService = void 0;
const prisma_1 = require("../../config/prisma");
exports.systemService = {
    upsertSetting: (actorId, payload) => prisma_1.prisma.platformSetting.upsert({
        where: { key: payload.key },
        update: {
            value: payload.value,
            updatedById: actorId,
        },
        create: {
            key: payload.key,
            value: payload.value,
            updatedById: actorId,
        },
    }),
    listSettings: () => prisma_1.prisma.platformSetting.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
            updatedBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
        },
    }),
};

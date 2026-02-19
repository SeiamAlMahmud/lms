import { prisma } from "../../config/prisma";

export const systemService = {
  upsertSetting: (actorId: string, payload: { key: string; value: unknown }) =>
    prisma.platformSetting.upsert({
      where: { key: payload.key },
      update: {
        value: payload.value as any,
        updatedById: actorId,
      },
      create: {
        key: payload.key,
        value: payload.value as any,
        updatedById: actorId,
      },
    }),

  listSettings: () =>
    prisma.platformSetting.findMany({
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

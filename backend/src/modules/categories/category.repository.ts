import { prisma } from "../../config/prisma";

export const categoryRepository = {
  create: (data: { name: string; slug: string }) => prisma.category.create({ data }),
  update: (id: string, data: { name?: string; slug?: string; isActive?: boolean }) =>
    prisma.category.update({ where: { id }, data }),
  findByName: (name: string) => prisma.category.findUnique({ where: { name } }),
  findById: (id: string) => prisma.category.findUnique({ where: { id } }),
  list: async (filters: { cursor?: string; limit: number; isActive?: boolean }) => {
    const rows = await prisma.category.findMany({
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

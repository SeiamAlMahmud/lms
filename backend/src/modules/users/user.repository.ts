import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  createAdmin: (data: { fullName: string; email: string; passwordHash: string }) =>
    prisma.user.create({
      data: {
        ...data,
        role: UserRole.ADMIN,
      },
    }),

  updateStatus: (id: string, status: UserStatus) =>
    prisma.user.update({ where: { id }, data: { status } }),

  listUsers: async (filters: {
    role?: UserRole;
    status?: UserStatus;
    cursor?: string;
    limit: number;
  }) => {
    const where: Prisma.UserWhereInput = {
      role: filters.role,
      status: filters.status,
    };

    const users = await prisma.user.findMany({
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

import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const authRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  countByRole: (role: UserRole) => prisma.user.count({ where: { role } }),
  createUser: (data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }) => prisma.user.create({ data }),
  updateRefreshTokenHash: (id: string, refreshTokenHash: string | null) =>
    prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    }),
};

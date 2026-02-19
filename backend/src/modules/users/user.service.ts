import { UserRole, UserStatus } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { hashPassword } from "../../shared/utils/password";
import { userRepository } from "./user.repository";

export const userService = {
  createAdmin: async (
    actor: { id: string; role: UserRole },
    payload: { fullName: string; email: string; password: string },
  ) => {
    if (actor.role !== UserRole.SUPER_ADMIN) {
      throw new AppError("Only super admin can create admin accounts", 403);
    }

    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    return userRepository.createAdmin({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash: await hashPassword(payload.password),
    });
  },

  updateUserStatus: async (
    actor: { id: string; role: UserRole },
    userId: string,
    status: UserStatus,
  ) => {
    const targetUser = await userRepository.findById(userId);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    if (actor.role === UserRole.ADMIN && targetUser.role === UserRole.SUPER_ADMIN) {
      throw new AppError("Admin cannot manage super admin", 403);
    }

    if (targetUser.id === actor.id && status !== UserStatus.ACTIVE) {
      throw new AppError("Cannot suspend or deactivate yourself", 400);
    }

    return userRepository.updateStatus(userId, status);
  },

  listUsers: async (filters: {
    role?: UserRole;
    status?: UserStatus;
    cursor?: string;
    limit: number;
  }) => {
    return userRepository.listUsers(filters);
  },
};

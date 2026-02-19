import { UserRole, UserStatus } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { comparePassword, hashPassword } from "../../shared/utils/password";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/token";
import { authRepository } from "./auth.repository";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  };
};

const buildTokens = async (
  user: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
  },
): Promise<AuthResponse> => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const refreshTokenHash = await hashPassword(refreshToken);

  await authRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
};

export const authService = {
  bootstrapSuperAdmin: async (payload: { fullName: string; email: string; password: string }) => {
    const totalSuperAdmins = await authRepository.countByRole(UserRole.SUPER_ADMIN);
    if (totalSuperAdmins > 0) {
      throw new AppError("Super admin already exists", 409);
    }

    const existing = await authRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const user = await authRepository.createUser({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash: await hashPassword(payload.password),
      role: UserRole.SUPER_ADMIN,
    });

    return buildTokens(user);
  },

  registerStudent: async (payload: { fullName: string; email: string; password: string }) => {
    const existing = await authRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const user = await authRepository.createUser({
      fullName: payload.fullName,
      email: payload.email,
      passwordHash: await hashPassword(payload.password),
      role: UserRole.STUDENT,
    });

    return buildTokens(user);
  },

  login: async (payload: { email: string; password: string }) => {
    const user = await authRepository.findByEmail(payload.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError("Account is not active", 403);
    }

    const isValid = await comparePassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return buildTokens(user);
  },

  refresh: async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await authRepository.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new AppError("Invalid refresh token", 401);
    }

    const isValid = await comparePassword(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError("Account is not active", 403);
    }

    return buildTokens(user);
  },

  logout: async (userId: string) => {
    await authRepository.updateRefreshTokenHash(userId, null);
  },
};

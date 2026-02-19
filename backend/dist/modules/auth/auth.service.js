"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const password_1 = require("../../shared/utils/password");
const token_1 = require("../../shared/utils/token");
const auth_repository_1 = require("./auth.repository");
const buildTokens = async (user) => {
    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, token_1.signAccessToken)(payload);
    const refreshToken = (0, token_1.signRefreshToken)(payload);
    const refreshTokenHash = await (0, password_1.hashPassword)(refreshToken);
    await auth_repository_1.authRepository.updateRefreshTokenHash(user.id, refreshTokenHash);
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
exports.authService = {
    bootstrapSuperAdmin: async (payload) => {
        const totalSuperAdmins = await auth_repository_1.authRepository.countByRole(client_1.UserRole.SUPER_ADMIN);
        if (totalSuperAdmins > 0) {
            throw new AppError_1.AppError("Super admin already exists", 409);
        }
        const existing = await auth_repository_1.authRepository.findByEmail(payload.email);
        if (existing) {
            throw new AppError_1.AppError("Email already in use", 409);
        }
        const user = await auth_repository_1.authRepository.createUser({
            fullName: payload.fullName,
            email: payload.email,
            passwordHash: await (0, password_1.hashPassword)(payload.password),
            role: client_1.UserRole.SUPER_ADMIN,
        });
        return buildTokens(user);
    },
    registerStudent: async (payload) => {
        const existing = await auth_repository_1.authRepository.findByEmail(payload.email);
        if (existing) {
            throw new AppError_1.AppError("Email already in use", 409);
        }
        const user = await auth_repository_1.authRepository.createUser({
            fullName: payload.fullName,
            email: payload.email,
            passwordHash: await (0, password_1.hashPassword)(payload.password),
            role: client_1.UserRole.STUDENT,
        });
        return buildTokens(user);
    },
    login: async (payload) => {
        const user = await auth_repository_1.authRepository.findByEmail(payload.email);
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new AppError_1.AppError("Account is not active", 403);
        }
        const isValid = await (0, password_1.comparePassword)(payload.password, user.passwordHash);
        if (!isValid) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        return buildTokens(user);
    },
    refresh: async (refreshToken) => {
        const payload = (0, token_1.verifyRefreshToken)(refreshToken);
        const user = await auth_repository_1.authRepository.findById(payload.sub);
        if (!user || !user.refreshTokenHash) {
            throw new AppError_1.AppError("Invalid refresh token", 401);
        }
        const isValid = await (0, password_1.comparePassword)(refreshToken, user.refreshTokenHash);
        if (!isValid) {
            throw new AppError_1.AppError("Invalid refresh token", 401);
        }
        if (user.status !== client_1.UserStatus.ACTIVE) {
            throw new AppError_1.AppError("Account is not active", 403);
        }
        return buildTokens(user);
    },
    logout: async (userId) => {
        await auth_repository_1.authRepository.updateRefreshTokenHash(userId, null);
    },
};

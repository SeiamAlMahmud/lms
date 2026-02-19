"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../../shared/errors/AppError");
const password_1 = require("../../shared/utils/password");
const user_repository_1 = require("./user.repository");
exports.userService = {
    createAdmin: async (actor, payload) => {
        if (actor.role !== client_1.UserRole.SUPER_ADMIN) {
            throw new AppError_1.AppError("Only super admin can create admin accounts", 403);
        }
        const existing = await user_repository_1.userRepository.findByEmail(payload.email);
        if (existing) {
            throw new AppError_1.AppError("Email already in use", 409);
        }
        return user_repository_1.userRepository.createAdmin({
            fullName: payload.fullName,
            email: payload.email,
            passwordHash: await (0, password_1.hashPassword)(payload.password),
        });
    },
    updateUserStatus: async (actor, userId, status) => {
        const targetUser = await user_repository_1.userRepository.findById(userId);
        if (!targetUser) {
            throw new AppError_1.AppError("User not found", 404);
        }
        if (actor.role === client_1.UserRole.ADMIN && targetUser.role === client_1.UserRole.SUPER_ADMIN) {
            throw new AppError_1.AppError("Admin cannot manage super admin", 403);
        }
        if (targetUser.id === actor.id && status !== client_1.UserStatus.ACTIVE) {
            throw new AppError_1.AppError("Cannot suspend or deactivate yourself", 400);
        }
        return user_repository_1.userRepository.updateStatus(userId, status);
    },
    listUsers: async (filters) => {
        return user_repository_1.userRepository.listUsers(filters);
    },
};

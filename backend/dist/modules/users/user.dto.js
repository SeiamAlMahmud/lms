"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersSchema = exports.updateUserStatusSchema = exports.createAdminSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.updateUserStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.UserStatus),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
exports.listUsersSchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        role: zod_1.z.nativeEnum(client_1.UserRole).optional(),
        status: zod_1.z.nativeEnum(client_1.UserStatus).optional(),
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    }),
});

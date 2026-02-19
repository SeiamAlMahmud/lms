"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapSuperAdminSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.refreshSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.bootstrapSuperAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});

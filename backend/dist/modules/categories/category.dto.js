"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategorySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({}),
});
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
    query: zod_1.z.object({}),
    params: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
});
exports.listCategorySchema = zod_1.z.object({
    body: zod_1.z.object({}),
    params: zod_1.z.object({}),
    query: zod_1.z.object({
        cursor: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().min(1).max(100).default(20),
        isActive: zod_1.z.coerce.boolean().optional(),
    }),
});

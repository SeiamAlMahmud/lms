"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const AppError_1 = require("../../shared/errors/AppError");
const category_repository_1 = require("./category.repository");
exports.categoryService = {
    create: async (payload) => {
        const existing = await category_repository_1.categoryRepository.findByName(payload.name);
        if (existing) {
            throw new AppError_1.AppError("Category already exists", 409);
        }
        return category_repository_1.categoryRepository.create({
            name: payload.name,
            slug: (0, slugify_1.default)(payload.name, { lower: true, strict: true }),
        });
    },
    update: async (id, payload) => {
        const category = await category_repository_1.categoryRepository.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        const updateData = {
            isActive: payload.isActive,
        };
        if (payload.name && payload.name !== category.name) {
            const existing = await category_repository_1.categoryRepository.findByName(payload.name);
            if (existing) {
                throw new AppError_1.AppError("Category already exists", 409);
            }
            updateData.name = payload.name;
            updateData.slug = (0, slugify_1.default)(payload.name, { lower: true, strict: true });
        }
        return category_repository_1.categoryRepository.update(id, updateData);
    },
    list: (query) => category_repository_1.categoryRepository.list(query),
};

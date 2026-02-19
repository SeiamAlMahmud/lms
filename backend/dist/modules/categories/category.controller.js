"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const request_1 = require("../../shared/utils/request");
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const category_service_1 = require("./category.service");
exports.categoryController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const row = await category_service_1.categoryService.create(req.body);
        res.status(201).json({ success: true, data: row });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const categoryId = (0, request_1.toSingleParam)(req.params.id, "id");
        const row = await category_service_1.categoryService.update(categoryId, req.body);
        res.status(200).json({ success: true, data: row });
    }),
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await category_service_1.categoryService.list(req.query);
        res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
    }),
};

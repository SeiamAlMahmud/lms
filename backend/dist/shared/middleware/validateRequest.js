"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const AppError_1 = require("../errors/AppError");
const validateRequest = (schema) => (req, _res, next) => {
    const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });
    if (!result.success) {
        return next(new AppError_1.AppError("Validation failed", 400, result.error.flatten()));
    }
    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;
    next();
};
exports.validateRequest = validateRequest;

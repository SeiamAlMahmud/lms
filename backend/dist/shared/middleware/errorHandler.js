"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = require("../errors/AppError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        return res.status(400).json({
            success: false,
            message: "Database error",
            code: err.code,
            meta: err.meta,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;

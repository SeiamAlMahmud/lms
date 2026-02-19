"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const AppError_1 = require("../errors/AppError");
const notFound = (_req, _res, next) => {
    next(new AppError_1.AppError("Route not found", 404));
};
exports.notFound = notFound;

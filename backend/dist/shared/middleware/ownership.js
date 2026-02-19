"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCourseOwnership = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../errors/AppError");
const request_1 = require("../utils/request");
const requireCourseOwnership = async (req, _res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    const id = (0, request_1.toSingleParam)(req.params.id, "id");
    const course = await prisma_1.prisma.course.findUnique({ where: { id } });
    if (!course || course.isDeleted) {
        return next(new AppError_1.AppError("Course not found", 404));
    }
    const isAdmin = req.user.role === client_1.UserRole.ADMIN || req.user.role === client_1.UserRole.SUPER_ADMIN;
    const isOwner = course.instructorId === req.user.id;
    if (!isAdmin && !isOwner) {
        return next(new AppError_1.AppError("Forbidden: not course owner", 403));
    }
    next();
};
exports.requireCourseOwnership = requireCourseOwnership;

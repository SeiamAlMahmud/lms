"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbidRoles = exports.authorize = exports.authenticate = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../errors/AppError");
const token_1 = require("../utils/token");
const authenticate = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError_1.AppError("Unauthorized", 401));
    }
    try {
        const token = authHeader.split(" ")[1];
        const payload = (0, token_1.verifyAccessToken)(token);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || user.status !== client_1.UserStatus.ACTIVE) {
            return next(new AppError_1.AppError("Unauthorized", 401));
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch {
        return next(new AppError_1.AppError("Invalid token", 401));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.AppError("Unauthorized", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("Forbidden", 403));
        }
        next();
    };
};
exports.authorize = authorize;
const forbidRoles = (...roles) => {
    return (req, _res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            return next(new AppError_1.AppError("Forbidden for this role", 403));
        }
        next();
    };
};
exports.forbidRoles = forbidRoles;

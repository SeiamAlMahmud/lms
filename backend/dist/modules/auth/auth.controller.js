"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const auth_service_1 = require("./auth.service");
exports.authController = {
    bootstrapSuperAdmin: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.bootstrapSuperAdmin(req.body);
        res.status(201).json({ success: true, data: result });
    }),
    register: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.registerStudent(req.body);
        res.status(201).json({ success: true, data: result });
    }),
    login: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        res.status(200).json({ success: true, data: result });
    }),
    refresh: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.refresh(req.body.refreshToken);
        res.status(200).json({ success: true, data: result });
    }),
    logout: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        await auth_service_1.authService.logout(req.user.id);
        res.status(200).json({ success: true, message: "Logged out" });
    }),
};

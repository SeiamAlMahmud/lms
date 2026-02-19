"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const request_1 = require("../../shared/utils/request");
const user_service_1 = require("./user.service");
exports.userController = {
    createAdmin: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const user = await user_service_1.userService.createAdmin(req.user, req.body);
        res.status(201).json({ success: true, data: user });
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = (0, request_1.toSingleParam)(req.params.id, "id");
        const user = await user_service_1.userService.updateUserStatus(req.user, userId, req.body.status);
        res.status(200).json({ success: true, data: user });
    }),
    listUsers: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await user_service_1.userService.listUsers(req.query);
        res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
    }),
};

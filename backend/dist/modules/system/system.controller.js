"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const system_service_1 = require("./system.service");
exports.systemController = {
    list: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const data = await system_service_1.systemService.listSettings();
        res.status(200).json({ success: true, data });
    }),
    upsert: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = await system_service_1.systemService.upsertSetting(req.user.id, req.body);
        res.status(200).json({ success: true, data });
    }),
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const analytics_service_1 = require("./analytics.service");
exports.analyticsController = {
    global: (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
        const data = await analytics_service_1.analyticsService.getGlobalAnalytics();
        res.status(200).json({ success: true, data });
    }),
    instructorMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const data = await analytics_service_1.analyticsService.getInstructorAnalytics(req.user.id);
        res.status(200).json({ success: true, data });
    }),
};

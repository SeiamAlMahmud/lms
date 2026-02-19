"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const request_1 = require("../../shared/utils/request");
const progress_service_1 = require("./progress.service");
exports.progressController = {
    completeLesson: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const lessonId = (0, request_1.toSingleParam)(req.params.lessonId, "lessonId");
        const result = await progress_service_1.progressService.completeLesson(req.user, lessonId);
        res.status(200).json({ success: true, data: result });
    }),
    getCourseProgress: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.courseId, "courseId");
        const result = await progress_service_1.progressService.getCourseProgress(req.user, courseId);
        res.status(200).json({ success: true, data: result });
    }),
};

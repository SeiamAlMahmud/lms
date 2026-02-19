"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const request_1 = require("../../shared/utils/request");
const lesson_service_1 = require("./lesson.service");
exports.lessonController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.courseId, "courseId");
        const lesson = await lesson_service_1.lessonService.create(req.user, courseId, req.body);
        res.status(201).json({ success: true, data: lesson });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const lessonId = (0, request_1.toSingleParam)(req.params.lessonId, "lessonId");
        const lesson = await lesson_service_1.lessonService.update(req.user, lessonId, req.body);
        res.status(200).json({ success: true, data: lesson });
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const lessonId = (0, request_1.toSingleParam)(req.params.lessonId, "lessonId");
        await lesson_service_1.lessonService.remove(req.user, lessonId);
        res.status(200).json({ success: true, message: "Lesson deleted" });
    }),
    listByCourse: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.courseId, "courseId");
        const lessons = await lesson_service_1.lessonService.listByCourse(courseId, req.user);
        res.status(200).json({ success: true, data: lessons });
    }),
};

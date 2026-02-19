"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const request_1 = require("../../shared/utils/request");
const course_service_1 = require("./course.service");
exports.courseController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const course = await course_service_1.courseService.create(req.user, req.body);
        res.status(201).json({ success: true, data: course });
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.id, "id");
        const course = await course_service_1.courseService.getById(courseId, req.user);
        res.status(200).json({ success: true, data: course });
    }),
    update: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.id, "id");
        const course = await course_service_1.courseService.update(courseId, req.body);
        res.status(200).json({ success: true, data: course });
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.id, "id");
        const course = await course_service_1.courseService.updateStatus(req.user, courseId, req.body.status);
        res.status(200).json({ success: true, data: course });
    }),
    remove: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.id, "id");
        const course = await course_service_1.courseService.softDelete(courseId);
        res.status(200).json({ success: true, data: course });
    }),
    list: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await course_service_1.courseService.list(req.query);
        res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
    }),
};

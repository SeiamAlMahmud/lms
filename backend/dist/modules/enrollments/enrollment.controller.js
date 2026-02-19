"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentController = void 0;
const asyncHandler_1 = require("../../shared/utils/asyncHandler");
const request_1 = require("../../shared/utils/request");
const enrollment_service_1 = require("./enrollment.service");
exports.enrollmentController = {
    enroll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const enrollment = await enrollment_service_1.enrollmentService.enroll(req.user, req.body);
        res.status(201).json({ success: true, data: enrollment });
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const enrollmentId = (0, request_1.toSingleParam)(req.params.enrollmentId, "enrollmentId");
        const enrollment = await enrollment_service_1.enrollmentService.updateMyEnrollmentStatus(req.user, enrollmentId, req.body.status);
        res.status(200).json({ success: true, data: enrollment });
    }),
    listMine: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await enrollment_service_1.enrollmentService.listMyEnrollments(req.user.id, req.query);
        res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
    }),
    listByCourse: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const courseId = (0, request_1.toSingleParam)(req.params.courseId, "courseId");
        const result = await enrollment_service_1.enrollmentService.listCourseEnrollments(req.user, courseId, req.query);
        res.status(200).json({ success: true, data: result.data, nextCursor: result.nextCursor });
    }),
};

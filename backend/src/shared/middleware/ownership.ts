import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../errors/AppError";
import { toSingleParam } from "../utils/request";

export const requireCourseOwnership = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  const id = toSingleParam(req.params.id, "id");
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course || course.isDeleted) {
    return next(new AppError("Course not found", 404));
  }

  const isAdmin = req.user.role === UserRole.ADMIN || req.user.role === UserRole.SUPER_ADMIN;
  const isOwner = course.instructorId === req.user.id;

  if (!isAdmin && !isOwner) {
    return next(new AppError("Forbidden: not course owner", 403));
  }

  next();
};

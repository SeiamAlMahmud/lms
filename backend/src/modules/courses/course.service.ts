import { CourseStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { courseRepository } from "./course.repository";

export const courseService = {
  create: async (
    actor: { id: string; role: UserRole },
    payload: {
      title: string;
      description?: string;
      thumbnailUrl?: string;
      categoryId?: string;
      isFree: boolean;
      price: number;
      instructorId?: string;
    },
  ) => {
    if (actor.role === UserRole.SUPER_ADMIN) {
      throw new AppError("Super admin cannot create courses", 403);
    }

    const instructorId = actor.role === UserRole.ADMIN ? payload.instructorId ?? actor.id : actor.id;

    if (!payload.isFree && payload.price <= 0) {
      throw new AppError("Paid course must have a positive price", 400);
    }

    return courseRepository.create({
      title: payload.title,
      description: payload.description,
      thumbnailUrl: payload.thumbnailUrl,
      category: payload.categoryId ? { connect: { id: payload.categoryId } } : undefined,
      isFree: payload.isFree,
      price: payload.isFree ? 0 : payload.price,
      instructor: { connect: { id: instructorId } },
      status: CourseStatus.DRAFT,
    });
  },

  getById: async (id: string, requester?: { id: string; role: UserRole }) => {
    const course = await courseRepository.findById(id);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    if (course.status !== CourseStatus.PUBLISHED && requester?.role === UserRole.STUDENT) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: requester.id,
            courseId: course.id,
          },
        },
      });

      if (!enrollment) {
        throw new AppError("Course is not publicly available", 403);
      }
    }

    return course;
  },

  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      thumbnailUrl?: string;
      categoryId?: string;
      isFree?: boolean;
      price?: number;
    },
  ) => {
    const existing = await courseRepository.findById(id);
    if (!existing || existing.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    const isFree = payload.isFree ?? existing.isFree;
    const price = payload.price ?? existing.price;

    if (!isFree && price <= 0) {
      throw new AppError("Paid course must have a positive price", 400);
    }

    return courseRepository.update(id, {
      title: payload.title,
      description: payload.description,
      thumbnailUrl: payload.thumbnailUrl,
      category: payload.categoryId
        ? {
            connect: { id: payload.categoryId },
          }
        : payload.categoryId === ""
          ? { disconnect: true }
          : undefined,
      isFree,
      price: isFree ? 0 : price,
    });
  },

  updateStatus: async (actor: { id: string; role: UserRole }, id: string, status: CourseStatus) => {
    const course = await courseRepository.findById(id);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    const isAdmin = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN;
    const isOwner = course.instructorId === actor.id;

    if (!isAdmin && !isOwner) {
      throw new AppError("Forbidden", 403);
    }

    if (actor.role === UserRole.INSTRUCTOR && status === CourseStatus.ARCHIVED && !isOwner) {
      throw new AppError("Forbidden", 403);
    }

    return courseRepository.update(id, { status });
  },

  softDelete: async (id: string) => {
    const course = await courseRepository.findById(id);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    return courseRepository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
      status: CourseStatus.ARCHIVED,
    });
  },

  list: (query: {
    cursor?: string;
    limit: number;
    search?: string;
    status?: CourseStatus;
    categoryId?: string;
    instructorId?: string;
    isFree?: boolean;
    sortBy: "createdAt" | "title" | "price";
    sortOrder: "asc" | "desc";
  }) => courseRepository.list(query),
};

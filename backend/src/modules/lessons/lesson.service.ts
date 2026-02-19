import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { lessonRepository } from "./lesson.repository";

const assertCoursePermission = (actor: { id: string; role: UserRole }, instructorId: string) => {
  const isAdmin = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN;
  const isOwner = instructorId === actor.id;

  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden", 403);
  }
};

export const lessonService = {
  create: async (
    actor: { id: string; role: UserRole },
    courseId: string,
    payload: {
      title: string;
      type: "VIDEO" | "TEXT";
      content?: string;
      videoUrl?: string;
      order: number;
      isPreview: boolean;
    },
  ) => {
    const course = await lessonRepository.findCourseById(courseId);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    assertCoursePermission(actor, course.instructorId);

    return lessonRepository.create({
      title: payload.title,
      type: payload.type,
      content: payload.content,
      videoUrl: payload.videoUrl,
      order: payload.order,
      isPreview: payload.isPreview,
      course: { connect: { id: courseId } },
    });
  },

  update: async (
    actor: { id: string; role: UserRole },
    lessonId: string,
    payload: {
      title?: string;
      type?: "VIDEO" | "TEXT";
      content?: string;
      videoUrl?: string;
      order?: number;
      isPreview?: boolean;
    },
  ) => {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson || lesson.course.isDeleted) {
      throw new AppError("Lesson not found", 404);
    }

    assertCoursePermission(actor, lesson.course.instructorId);

    return lessonRepository.update(lessonId, payload);
  },

  remove: async (actor: { id: string; role: UserRole }, lessonId: string) => {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson || lesson.course.isDeleted) {
      throw new AppError("Lesson not found", 404);
    }

    assertCoursePermission(actor, lesson.course.instructorId);

    return lessonRepository.remove(lessonId);
  },

  listByCourse: async (courseId: string, actor?: { id: string; role: UserRole }) => {
    const course = await lessonRepository.findCourseById(courseId);
    if (!course || course.isDeleted) {
      throw new AppError("Course not found", 404);
    }

    const lessons = await lessonRepository.listByCourse(courseId);

    if (!actor) {
      return lessons.filter((lesson) => lesson.isPreview);
    }

    if (actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN || actor.id === course.instructorId) {
      return lessons;
    }

    if (actor.role === UserRole.STUDENT) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: actor.id,
            courseId,
          },
        },
      });

      if (enrollment) {
        return lessons;
      }

      return lessons.filter((lesson) => lesson.isPreview);
    }

    return lessons.filter((lesson) => lesson.isPreview);
  },
};

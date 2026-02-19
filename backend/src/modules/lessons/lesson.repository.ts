import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const lessonRepository = {
  findCourseById: (courseId: string) => prisma.course.findUnique({ where: { id: courseId } }),
  create: (data: Prisma.LessonCreateInput) => prisma.lesson.create({ data }),
  findById: (lessonId: string) =>
    prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: true },
    }),
  update: (lessonId: string, data: Prisma.LessonUpdateInput) =>
    prisma.lesson.update({ where: { id: lessonId }, data }),
  remove: (lessonId: string) => prisma.lesson.delete({ where: { id: lessonId } }),
  listByCourse: (courseId: string) =>
    prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    }),
};

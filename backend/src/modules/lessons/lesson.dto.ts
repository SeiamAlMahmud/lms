import { LessonType } from "@prisma/client";
import { z } from "zod";

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    type: z.nativeEnum(LessonType),
    content: z.string().optional(),
    videoUrl: z.string().url().optional(),
    order: z.number().int().positive(),
    isPreview: z.boolean().default(false),
  }),
  query: z.object({}),
  params: z.object({
    courseId: z.string().min(1),
  }),
});

export const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    type: z.nativeEnum(LessonType).optional(),
    content: z.string().optional(),
    videoUrl: z.string().url().optional(),
    order: z.number().int().positive().optional(),
    isPreview: z.boolean().optional(),
  }),
  query: z.object({}),
  params: z.object({
    lessonId: z.string().min(1),
  }),
});

export const lessonCourseParamSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    courseId: z.string().min(1),
  }),
});

export const lessonIdParamSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    lessonId: z.string().min(1),
  }),
});

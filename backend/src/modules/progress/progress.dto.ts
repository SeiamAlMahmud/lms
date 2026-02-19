import { z } from "zod";

export const completeLessonSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    lessonId: z.string().min(1),
  }),
});

export const courseProgressSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    courseId: z.string().min(1),
  }),
});

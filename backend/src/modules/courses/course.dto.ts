import { CourseStatus } from "@prisma/client";
import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    thumbnailUrl: z.string().url().optional(),
    categoryId: z.string().optional(),
    isFree: z.boolean().default(true),
    price: z.number().min(0).default(0),
    instructorId: z.string().optional(),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    thumbnailUrl: z.string().url().optional(),
    categoryId: z.string().optional(),
    isFree: z.boolean().optional(),
    price: z.number().min(0).optional(),
  }),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateCourseStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(CourseStatus),
  }),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listCourseSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
    categoryId: z.string().optional(),
    instructorId: z.string().optional(),
    isFree: z.coerce.boolean().optional(),
    sortBy: z.enum(["createdAt", "title", "price"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }),
});

export const courseIdParamSchema = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

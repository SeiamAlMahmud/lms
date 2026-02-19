import { EnrollmentStatus } from "@prisma/client";
import { z } from "zod";

export const enrollSchema = z.object({
  body: z.object({
    courseId: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateEnrollmentStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(EnrollmentStatus),
  }),
  query: z.object({}),
  params: z.object({
    enrollmentId: z.string().min(1),
  }),
});

export const listEnrollmentSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: z.nativeEnum(EnrollmentStatus).optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),
});

export const courseEnrollmentParamSchema = z.object({
  body: z.object({}),
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),
  params: z.object({
    courseId: z.string().min(1),
  }),
});

import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

export const createAdminSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listUsersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(UserStatus).optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
  }),
});

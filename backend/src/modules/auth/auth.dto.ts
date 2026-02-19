import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const bootstrapSuperAdminSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  query: z.object({}),
  params: z.object({}),
});

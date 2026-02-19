import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
  }),
  query: z.object({}),
  params: z.object({}),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    isActive: z.boolean().optional(),
  }),
  query: z.object({}),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listCategorySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
    isActive: z.coerce.boolean().optional(),
  }),
});

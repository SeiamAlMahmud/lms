import { z } from "zod";

export const upsertSettingSchema = z.object({
  body: z.object({
    key: z.string().min(1),
    value: z.any(),
  }),
  query: z.object({}),
  params: z.object({}),
});

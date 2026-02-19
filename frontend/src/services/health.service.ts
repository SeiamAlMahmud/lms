export type HealthResponse = {
  success: boolean;
  message: string;
};

import { apiFetch } from "@/lib/api";

export const healthService = {
  check: () => apiFetch<HealthResponse>("/"),
};

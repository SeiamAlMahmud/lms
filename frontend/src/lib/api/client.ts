import { env } from "@/config/env";
import { ApiResponse } from "@/types";

type ApiOptions = RequestInit & {
  token?: string | null;
};

const normalizeUrl = (path: string) => {
  const base = env.apiUrl.replace(/\/$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}`;
};

export async function apiClient<T>(path: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const response = await fetch(normalizeUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(payload.message || "API request failed");
  }

  return payload;
}

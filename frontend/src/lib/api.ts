import { env } from "@/config/env";

type RequestOptions = RequestInit & {
  headers?: HeadersInit;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = env.apiUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${baseUrl}${normalizedPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

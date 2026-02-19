import { apiClient } from "@/lib/api/client";
import { AuthState } from "@/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthState["user"];
};

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

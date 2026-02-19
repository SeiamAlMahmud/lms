export type UserRole = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

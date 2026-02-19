import { apiClient } from "@/lib/api/client";

export type GlobalAnalytics = {
  totalCourses: number;
  totalActiveStudents: number;
  enrollmentGrowth: Array<{ date: string; count: number }>;
  topPopularCourses: Array<{ courseId: string; title: string; totalEnrollments: number }>;
};

export type InstructorAnalytics = {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  completionRate: number;
};

export const analyticsApi = {
  getGlobal: (token: string) => apiClient<GlobalAnalytics>("/api/v1/analytics/global", { token }),
  getInstructor: (token: string) => apiClient<InstructorAnalytics>("/api/v1/analytics/instructor/me", { token }),
};

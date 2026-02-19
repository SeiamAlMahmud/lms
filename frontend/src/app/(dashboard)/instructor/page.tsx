"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { StatCard } from "@/components/ui/StatCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { analyticsApi, InstructorAnalytics } from "@/lib/api/analytics";
import { useAuth } from "@/hooks/useAuth";

export default function InstructorDashboardPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<InstructorAnalytics | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!accessToken) return;
      try {
        const response = await analyticsApi.getInstructor(accessToken);
        setData(response.data);
      } catch {
        setData({ totalCourses: 0, totalStudents: 0, totalRevenue: 0, completionRate: 0 });
      }
    };

    void run();
  }, [accessToken]);

  return (
    <RoleGuard roles={["INSTRUCTOR"]}>
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">Instructor Dashboard</h2>
          <p className="text-sm text-slate-500">Manage courses, learners, and completion outcomes.</p>
        </header>

        {!data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="My Courses" value={data.totalCourses} />
            <StatCard title="Total Students" value={data.totalStudents} />
            <StatCard title="Revenue" value={`$${data.totalRevenue}`} />
            <StatCard title="Completion Rate" value={`${data.completionRate}%`} />
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

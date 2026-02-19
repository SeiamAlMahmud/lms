"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { StatCard } from "@/components/ui/StatCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { analyticsApi, GlobalAnalytics } from "@/lib/api/analytics";
import { useAuth } from "@/hooks/useAuth";
import { LazyEnrollmentChart } from "@/components/dashboard/LazyEnrollmentChart";

export default function AdminDashboardPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<GlobalAnalytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!accessToken) return;
      try {
        const response = await analyticsApi.getGlobal(accessToken);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      }
    };

    void run();
  }, [accessToken]);

  return (
    <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Analytics Dashboard</h2>
          <p className="text-sm text-slate-500">Platform-wide operational and growth metrics.</p>
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
            <StatCard title="Total Courses" value={data.totalCourses} />
            <StatCard title="Active Students" value={data.totalActiveStudents} />
            <StatCard title="Popular Course #1" value={data.topPopularCourses[0]?.title || "N/A"} />
            <StatCard title="Enrollments (Today)" value={data.enrollmentGrowth[data.enrollmentGrowth.length - 1]?.count || 0} />
          </div>
        )}

        {data ? <LazyEnrollmentChart points={data.enrollmentGrowth} /> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </RoleGuard>
  );
}

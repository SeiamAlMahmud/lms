"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { StatCard } from "@/components/ui/StatCard";

export default function StudentDashboardPage() {
  return (
    <RoleGuard roles={["STUDENT"]}>
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-semibold text-slate-900">Student Learning Dashboard</h2>
          <p className="text-sm text-slate-500">Track active, completed, and dropped courses.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Active Courses" value={0} />
          <StatCard title="Completed Courses" value={0} />
          <StatCard title="Dropped Courses" value={0} />
          <StatCard title="Overall Progress" value="0%" />
        </div>
      </div>
    </RoleGuard>
  );
}

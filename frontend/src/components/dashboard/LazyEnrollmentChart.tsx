"use client";

import dynamic from "next/dynamic";

const EnrollmentTrendChart = dynamic(() => import("@/components/charts/EnrollmentTrendChart"), {
  ssr: false,
  loading: () => <div className="h-44 animate-pulse rounded-xl bg-slate-200" />,
});

export function LazyEnrollmentChart({ points }: { points: Array<{ date: string; count: number }> }) {
  return <EnrollmentTrendChart points={points} />;
}

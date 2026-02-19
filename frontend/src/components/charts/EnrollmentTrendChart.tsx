"use client";

type Props = {
  points: Array<{ date: string; count: number }>;
};

export default function EnrollmentTrendChart({ points }: Props) {
  const max = Math.max(...points.map((point) => point.count), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">Enrollment Trend (10 days)</h3>
      <div className="flex h-32 items-end gap-2">
        {points.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center justify-end gap-1">
            <div
              className="w-full rounded-t bg-emerald-500"
              style={{ height: `${Math.max((point.count / max) * 100, 6)}%` }}
              title={`${point.date}: ${point.count}`}
            />
            <span className="text-[10px] text-slate-500">{point.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

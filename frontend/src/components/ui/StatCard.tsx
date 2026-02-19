import clsx from "clsx";

type CardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
};

export function StatCard({ title, value, subtitle, className }: CardProps) {
  return (
    <article className={clsx("rounded-xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
    </article>
  );
}

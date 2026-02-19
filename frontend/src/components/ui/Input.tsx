import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-slate-700">{label}</span>
      <input
        className={clsx(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2",
          error
            ? "border-red-400 focus:ring-red-200"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2 text-sm font-medium transition",
        variant === "primary"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
        className,
      )}
      {...props}
    />
  );
}

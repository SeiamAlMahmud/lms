"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const linksByRole = {
  ADMIN: [{ href: "/admin", label: "Admin Dashboard" }],
  SUPER_ADMIN: [{ href: "/admin", label: "Platform Dashboard" }],
  INSTRUCTOR: [{ href: "/instructor", label: "Instructor Dashboard" }],
  STUDENT: [{ href: "/student", label: "Learning Dashboard" }],
} as const;

export function Sidebar() {
  const { user } = useAuth();
  const links = user ? linksByRole[user.role] : [];

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Navigation</p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

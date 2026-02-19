"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const buttonStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
    background: "#fff",
    marginRight: "10px",
    marginBottom: "10px",
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Learning Management System</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Multi-role LMS frontend using Next.js, TypeScript, Redux Toolkit, React Hook Form, Zod, role
          protection, reusable components, and API abstraction.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            style={{ ...buttonStyle, background: "#0b7f76", borderColor: "#0b7f76", color: "#fff" }}
          >
            Login
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            style={buttonStyle}
          >
            Admin
          </Link>
          <Link
            href="/instructor"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            style={buttonStyle}
          >
            Instructor
          </Link>
          <Link
            href="/student"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            style={buttonStyle}
          >
            Student
          </Link>
        </div>
        {isAuthenticated && user ? (
          <p className="mt-4 text-sm text-emerald-700">Signed in as {user.role}</p>
        ) : null}
      </section>
    </main>
  );
}

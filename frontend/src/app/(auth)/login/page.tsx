"use client";

import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">Sign in</h2>
        <p className="mb-5 text-sm text-slate-500">Use your LMS account credentials.</p>
        <LoginForm />
      </section>
    </main>
  );
}

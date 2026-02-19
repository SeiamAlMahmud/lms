"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <section className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-700">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>
        <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}

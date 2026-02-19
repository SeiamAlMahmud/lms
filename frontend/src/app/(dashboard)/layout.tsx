import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <section>{children}</section>
    </main>
  );
}

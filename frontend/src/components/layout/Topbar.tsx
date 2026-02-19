"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function Topbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800">LMS Platform</h1>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? <span className="text-sm text-slate-600">{user.fullName}</span> : null}
          {isAuthenticated ? (
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

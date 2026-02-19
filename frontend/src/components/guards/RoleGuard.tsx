"use client";

import type { ReactNode } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

type RoleGuardProps = {
  roles: UserRole[];
  children: ReactNode;
};

export function RoleGuard({ roles, children }: RoleGuardProps) {
  const { isAuthenticated, user } = useAuth();
  useRoleRedirect(roles);

  if (!isAuthenticated || !user || !roles.includes(user.role)) {
    return <div className="p-6 text-sm text-slate-500">Checking permissions...</div>;
  }

  return <>{children}</>;
}

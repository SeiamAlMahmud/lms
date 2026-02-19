"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { useAuth } from "./useAuth";

export const useRoleRedirect = (roles: UserRole[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [isAuthenticated, roles, router, user, pathname]);
};

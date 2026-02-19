"use client";

import { clearSession } from "@/store/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const logout = () => {
    localStorage.removeItem("lms_auth");
    dispatch(clearSession());
  };

  return {
    ...auth,
    isAuthenticated: Boolean(auth.accessToken && auth.user),
    logout,
  };
};

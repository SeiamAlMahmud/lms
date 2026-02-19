"use client";

import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { setSession } from "@/store/features/authSlice";
import { store } from "@/store";

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    const raw = localStorage.getItem("lms_auth");
    if (raw) {
      try {
        store.dispatch(setSession(JSON.parse(raw)));
      } catch {
        localStorage.removeItem("lms_auth");
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

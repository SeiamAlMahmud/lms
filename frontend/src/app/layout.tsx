import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "LMS Platform",
  description: "Production-ready LMS frontend",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Topbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

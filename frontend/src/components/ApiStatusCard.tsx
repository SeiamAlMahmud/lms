"use client";

import { useEffect, useState } from "react";
import { healthService, type HealthResponse } from "@/services/health.service";

export default function ApiStatusCard() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const result = await healthService.check();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect API");
      }
    };

    void run();
  }, []);

  return (
    <section
      style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#ffffff",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Backend Status</h2>
      {data && <p>{data.message}</p>}
      {error && <p style={{ color: "#dc2626" }}>{error}</p>}
      {!data && !error && <p>Checking API...</p>}
    </section>
  );
}

import ApiStatusCard from "@/components/ApiStatusCard";
import { env } from "@/config/env";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1>LMS Frontend</h1>
      <p>Next.js + TypeScript setup complete.</p>
      <p>
        API Base URL: <code>{env.apiUrl}</code>
      </p>
      <ApiStatusCard />
    </main>
  );
}

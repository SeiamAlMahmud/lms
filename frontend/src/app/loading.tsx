import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </main>
  );
}

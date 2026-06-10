import type { ReactNode } from "react";

type AggregateStatCardProps = {
  label: string;
  value: ReactNode;
};

export function AggregateStatCard({ label, value }: AggregateStatCardProps) {
  return (
    <div className="rounded-xl bg-zinc-800 p-3 md:p-4">
      <span className="mb-1 block text-xs text-zinc-400 md:text-sm">
        {label}
      </span>
      <span className="text-xl font-bold text-white md:text-2xl">{value}</span>
    </div>
  );
}

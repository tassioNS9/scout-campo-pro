import type { ReactNode } from "react";

type MatchStatRowProps = {
  label: string;
  value: ReactNode;
};

export function MatchStatRow({ label, value }: MatchStatRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

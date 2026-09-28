"use client";

import { Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Time } from "@/db/schema";

const categoryClasses: Record<string, string> = {
  "Sub-17":
    "border-scout-green-border bg-scout-green-dim text-scout-green hover:bg-scout-green hover:text-scout-bg",
  "Sub-20":
    "border-scout-sub20-border bg-scout-sub20-bg text-scout-sub20-text hover:bg-scout-sub20-text hover:text-scout-bg",
  Profissional:
    "border-scout-profissional-border bg-scout-profissional-bg text-scout-profissional-text hover:bg-scout-profissional-text hover:text-scout-bg",
};

const categories = ["Sub-17", "Sub-20", "Profissional"];

const FilterComponent = ({ times }: { times: Time[] }) => {
  const allCategories = ["Todas", ...categories];
  const [filterCat, setFilterCat] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = times.filter((t) => {
    const matchSearch =
      t.nome.toLowerCase().includes(search.toLowerCase()) ||
      t.cidade?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "Todas" || t.categoria === filterCat;
    return matchSearch && matchCat;
  });

  void filtered;
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Users
          size={14}
          className="text-scout-dim absolute top-1/2 left-3 -translate-y-1/2"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou cidade..."
          className="w-full rounded-lg border border-scout-border bg-scout-card py-2 pr-4 pl-9 text-sm text-scout-text outline-none placeholder:text-scout-dim focus:border-scout-green"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => {
          const active = filterCat === cat;
          const categoryClass = categoryClasses[cat];
          return (
            <Button
              type="button"
              variant="ghost"
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`h-auto rounded-full border px-3 py-1.5 text-xs transition-colors ${
                active
                  ? (categoryClass ??
                    "border-scout-green-border bg-scout-green-dim text-scout-green hover:bg-scout-green hover:text-scout-bg")
                  : "border-scout-border bg-scout-card-header text-scout-muted hover:bg-scout-card-hover hover:text-scout-text"
              }`}
            >
              {cat}
            </Button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-scout-border">
        {[
          { label: "Times", value: times.length },
          {
            label: "Jogadores",
            value: times.length * 23,
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`bg-scout-card px-4 py-2 text-center ${
              i > 0 ? "border-l border-scout-border" : ""
            }`}
          >
            <p className="mb-0 text-[1rem] text-scout-green">{s.value}</p>
            <p className="mb-0 text-[0.65rem] text-scout-dim">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterComponent;

"use client";

import {
  Calendar,
  LayoutDashboard,
  Pencil,
  Swords,
  Trash2,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Partida } from "@/db/queries";

interface PartidasProps {
  partidas: Partida[];
}

type Status = "planejada" | "em_andamento" | "finalizada";

const statusClasses: Record<Status, string> = {
  planejada: "border-scout-sub17-border bg-scout-sub17-bg text-scout-sub17-text",
  em_andamento: "border-scout-green-border bg-scout-green-dim text-scout-green",
  finalizada: "border-scout-border bg-scout-card-header text-scout-muted",
};

const filterLabels: ("Todas" | Status)[] = [
  "Todas",
  "planejada",
  "em_andamento",
  "finalizada",
];

const PartidaList = ({ partidas }: PartidasProps) => {
  const [matches, setMatches] = useState<Partida[]>(partidas);
  const [filter, setFilter] = useState<"Todas" | Status>("Todas");

  const filtered =
    filter === "Todas" ? matches : matches.filter((m) => m.status === filter);

  return (
    <div>
      {/* Filter tabs + summary */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filterLabels.map((f) => {
            const active = filter === f;
            const statusClass =
              f !== "Todas" ? statusClasses[f as Status] : "border-scout-border bg-scout-card-header text-scout-muted";

            return (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active ? statusClass : "border-scout-border bg-scout-card-header text-scout-muted"
                }`}
              >
                {f}
                {f !== "Todas" &&
                  ` (${matches.filter((m) => m.status === f).length})`}
              </Button>
            );
          })}
        </div>

        {/* Counts */}
        <div className="flex shrink-0 items-center overflow-hidden rounded-lg border border-scout-border">
          {[
            { label: "Total", value: matches.length },
            {
              label: "Planejadas",
              value: matches.filter((m) => m.status === "planejada").length,
            },
            {
              label: "Finalizadas",
              value: matches.filter((m) => m.status === "finalizada").length,
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-2 text-center ${
                i > 0 ? "border-l border-scout-border" : ""
              } bg-scout-card`}
            >
              <p className="text-[1rem] text-scout-green">{s.value}</p>
              <p className="text-[0.65rem] text-scout-dim">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-scout-muted">
          <Swords size={44} className="mx-auto mb-3 opacity-20" />
          <p>Nenhuma partida encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered
            .sort(
              (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
            )
            .map((match) => {
              const statusClass = statusClasses[match.status!];
              return (
                <div
                  key={match.id}
                  className="flex flex-col gap-4 rounded-xl border border-scout-border bg-scout-card p-4 transition-colors md:p-5"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${statusClass}`}
                    >
                      {match.status}
                    </span>
                  </div>

                  {/* Scoreboard */}
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-scout-border bg-scout-card-header p-4">
                    <div className="flex-1 text-center">
                      <p className="mb-2 text-[0.78rem] leading-[1.3] text-scout-muted">
                        {match.nomeTime}
                      </p>
                      <p className="text-[2rem] leading-none text-scout-green">
                        {match.placarTime}
                      </p>
                    </div>
                    <span className="text-[1.1rem] text-scout-dim">×</span>
                    <div className="flex-1 text-center">
                      <p className="mb-2 text-[0.78rem] leading-[1.3] text-scout-muted">
                        {match.nomeTimeAdversario}
                      </p>
                      <p className="text-[2rem] leading-none text-scout-green">
                        {match.placarTimeAdversario}
                      </p>
                    </div>
                  </div>

                  {/* Match info */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-scout-dim" />
                      <span className="text-[0.82rem] text-scout-muted">
                        {new Date(match.data).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={13} className="text-scout-dim" />
                      <span className="text-[0.82rem] text-scout-muted">
                        {match.campeonato}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[0.82rem] text-scout-muted">
                        <span className="text-scout-dim">Categoria: </span>
                        {match.categoria}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-scout-border pt-1">
                    <Button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-scout-green-border bg-scout-green-dim px-3 py-2 text-xs text-scout-green">
                      <LayoutDashboard size={13} />
                      Dashboard
                    </Button>
                    <Button
                      className="flex items-center justify-center rounded-lg border border-scout-sub17-border bg-scout-sub17-bg px-3 py-2 text-xs text-scout-sub17-text"
                      title="Editar"
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      onClick={() =>
                        setMatches((prev) =>
                          prev.filter((m) => m.id !== match.id),
                        )
                      }
                      className="flex items-center justify-center rounded-lg border border-scout-profissional-border bg-scout-profissional-bg px-3 py-2 text-xs text-scout-profissional-text"
                      title="Excluir"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default PartidaList;

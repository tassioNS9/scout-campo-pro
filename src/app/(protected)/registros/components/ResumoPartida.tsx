"use client";

import { Activity } from "lucide-react";

interface ResumoPartidaData {
  gols: number;
  faltas: number;
  desarmes: number;
  assistencias: number;
  totalEventos: number;
}

const summaryCards = (m: ResumoPartidaData | null | undefined) => [
  {
    label: "Gols",
    value: m?.gols,
    colorClass: "text-scout-green",
    dimBgClass: "bg-scout-green-dim",
    borderClass: "border-scout-green-border",
  },
  {
    label: "Faltas",
    value: m?.faltas,
    colorClass: "text-scout-zagueiro-text",
    dimBgClass: "bg-scout-zagueiro-bg",
    borderClass: "border-scout-zagueiro-border",
  },
  {
    label: "Desarmes",
    value: m?.desarmes,
    colorClass: "text-scout-volante-text",
    dimBgClass: "bg-scout-volante-bg",
    borderClass: "border-scout-volante-border",
  },
  {
    label: "Assistências",
    value: m?.assistencias,
    colorClass: "text-scout-meia-text",
    dimBgClass: "bg-scout-meia-bg",
    borderClass: "border-scout-meia-border",
  },
];

const ResumoPartida = ({
  match,
}: {
  match: ResumoPartidaData | null | undefined;
}) => {
  return (
    <div className="border-scout-border bg-scout-card rounded-xl border p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={15} className="text-scout-green" />
        <h2 className="text-scout-text text-sm">Resumo da Partida</h2>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        {summaryCards(match).map((s) => (
          <div
            key={s.label}
            className={`flex flex-col rounded-xl border p-4 ${s.dimBgClass} ${s.borderClass}`}
          >
            <span className="text-scout-muted mb-1 text-xs">{s.label}</span>
            <span className={`text-3xl leading-none ${s.colorClass}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Total de Eventos */}
      <div className="border-scout-border bg-scout-card-header flex flex-col items-center rounded-xl border p-4">
        <span className="text-scout-muted mb-1 text-xs">Total de Eventos</span>
        <span className="text-scout-text text-3xl leading-none">
          {match?.totalEventos}
        </span>
      </div>
    </div>
  );
};

export default ResumoPartida;

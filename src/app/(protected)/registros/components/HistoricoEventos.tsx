"use client";

import { Activity } from "lucide-react";

interface HistoricoEventosProps {
  eventos: {
    id: number;
    minuto: number;
    tipoEvento: string;
  }[];
}

const HistoricoEventos = ({ eventos }: HistoricoEventosProps) => {
  return (
    <div className="rounded-xl border border-scout-border bg-scout-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={15} className="text-scout-green" />
        <h2 className="text-sm text-scout-text">
          Histórico de Eventos
        </h2>
        <span
          className="ml-auto rounded-full border border-scout-green-border bg-scout-green-dim px-2 py-0.5 text-xs text-scout-green"
        >
          {eventos?.length} eventos
        </span>
      </div>

      {eventos?.length === 0 ? (
        <p className="text-sm text-scout-muted">
          Nenhum evento registrado para esta partida.
        </p>
      ) : (
        <div className="flex flex-col">
          {eventos?.map((ev, i) => {
            return (
              <div
                key={ev.id}
                className={`flex items-center gap-3 py-3 transition-colors ${i < eventos.length - 1 ? "border-b border-scout-border" : ""}`}
              >
                {/* Time badge */}
                <div
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-scout-border bg-scout-card-header px-2 py-1"
                >
                  <span className="text-[10px] text-scout-dim">
                    {ev.minuto}T
                  </span>
                </div>

                {/* Event type */}
                <span
                  className="flex-1 text-sm text-scout-text"
                >
                  {ev.tipoEvento}
                </span>

                {/* Category + player */}
                <div className="flex items-center gap-2">
                  <span
                    className="truncate text-xs text-scout-muted"
                  >
                    {ev?.minuto ?? "Sem detalhes"}&quot;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoricoEventos;

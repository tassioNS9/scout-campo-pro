"use client";

import { Activity } from "lucide-react";

import { C } from "@/constants/Colors";

interface HistoricoEventosProps {
  eventos: {
    id: number;
    minuto: number;
    tipoEvento: string;
  }[];
}

const HistoricoEventos = ({ eventos }: HistoricoEventosProps) => {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Activity size={15} style={{ color: C.green }} />
        <h2 className="text-white" style={{ fontSize: "0.95rem" }}>
          Histórico de Eventos
        </h2>
        <span
          className="ml-auto rounded-full px-2 py-0.5 text-xs"
          style={{
            backgroundColor: C.greenDim,
            color: C.green,
            border: `1px solid ${C.greenBorder}`,
          }}
        >
          {eventos?.length} eventos
        </span>
      </div>

      {eventos?.length === 0 ? (
        <p style={{ color: C.muted, fontSize: "0.88rem" }}>
          Nenhum evento registrado para esta partida.
        </p>
      ) : (
        <div className="flex flex-col">
          {eventos?.map((ev, i) => {
            return (
              <div
                key={ev.id}
                className="flex items-center gap-3 py-3 transition-colors"
                style={{
                  borderBottom:
                    i < eventos.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                {/* Time badge */}
                <div
                  className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1"
                  style={{
                    backgroundColor: C.cardHeader,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ color: C.dim, fontSize: "0.65rem" }}>
                    {ev.minuto}T
                  </span>
                </div>

                {/* Event type */}
                <span
                  className="flex-1 text-white"
                  style={{ fontSize: "0.88rem" }}
                >
                  {ev.tipoEvento}
                </span>

                {/* Category + player */}
                <div className="flex items-center gap-2">
                  <span
                    className="truncate"
                    style={{ color: C.muted, fontSize: "0.82rem" }}
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

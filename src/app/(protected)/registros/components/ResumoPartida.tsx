"use client";

import { Activity } from "lucide-react";

import { C } from "@/constants/Colors";

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
    color: "#00e676",
    dimBg: "#1a3b2a",
    border: "#1a4d30",
  },
  {
    label: "Faltas",
    value: m?.faltas,
    color: "#60a5fa",
    dimBg: "#1a2540",
    border: "#1a3560",
  },
  {
    label: "Desarmes",
    value: m?.desarmes,
    color: "#c084fc",
    dimBg: "#201a2e",
    border: "#301a4a",
  },
  {
    label: "Assistências",
    value: m?.assistencias,
    color: "#fb923c",
    dimBg: "#2e2018",
    border: "#4a2e10",
  },
];

const ResumoPartida = ({
  match,
}: {
  match: ResumoPartidaData | null | undefined;
}) => {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Activity size={15} style={{ color: C.green }} />
        <h2 className="text-white" style={{ fontSize: "0.95rem" }}>
          Resumo da Partida
        </h2>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        {summaryCards(match).map((s) => (
          <div
            key={s.label}
            className="flex flex-col rounded-xl p-4"
            style={{
              backgroundColor: s.dimBg,
              border: `1px solid ${s.border}`,
            }}
          >
            <span
              style={{ color: C.muted, fontSize: "0.78rem" }}
              className="mb-1"
            >
              {s.label}
            </span>
            <span
              style={{
                color: s.color,
                fontSize: "1.8rem",
                lineHeight: 1,
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Total de Eventos */}
      <div
        className="flex flex-col items-center rounded-xl p-4"
        style={{
          backgroundColor: C.cardHeader,
          border: `1px solid ${C.border}`,
        }}
      >
        <span style={{ color: C.muted, fontSize: "0.78rem" }} className="mb-1">
          Total de Eventos
        </span>
        <span
          className="text-white"
          style={{ fontSize: "1.8rem", lineHeight: 1 }}
        >
          {match?.totalEventos}
        </span>
      </div>
    </div>
  );
};

export default ResumoPartida;

"use client";

import { Trophy } from "lucide-react";

import { C } from "@/constants/Colors";

interface EstatisticaRanking {
  id: number;
  idJogador: number;
  nota: number;
}

const RankingJogadores = ({
  estatistica,
}: {
  estatistica?: EstatisticaRanking[];
}) => {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Trophy size={15} style={{ color: C.green }} />
        <h2 className="text-white" style={{ fontSize: "0.95rem" }}>
          Ranking de Jogadores
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        {estatistica?.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors"
            style={{
              borderBottom:
                i < estatistica?.length - 1 ? `1px solid ${C.border}` : "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = C.cardHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {/* Rank badge */}
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
              style={{
                backgroundColor: i === 0 ? "#2e2018" : C.cardHeader,
                color: i === 0 ? "#fb923c" : C.muted,
                border: `1px solid ${i === 0 ? "#4a2e10" : C.border}`,
              }}
            >
              #{i + 1}
            </span>

            <span className="flex-1 text-white" style={{ fontSize: "0.9rem" }}>
              Jogador#{p.idJogador}
            </span>

            <div className="flex items-center gap-3">
              <span style={{ color: C.dim }}>Nota </span>
              <span style={{ color: C.text }}>{p.nota}</span>

              {/* <span style={{ color: C.muted, fontSize: "0.8rem" }}>
                <span style={{ color: C.dim }}>assist. </span>
                <span style={{ color: C.text }}>3</span>
              </span> */}
              {/* <span
                style={{
                  color: ratingColor(p.rating),
                  fontSize: "0.95rem",
                  minWidth: "2.5rem",
                  textAlign: "right",
                }}
              >
                {p.nota}
              </span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingJogadores;

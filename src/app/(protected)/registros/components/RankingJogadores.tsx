"use client";

import { Trophy } from "lucide-react";

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
    <div className="rounded-xl border border-scout-border bg-scout-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Trophy size={15} className="text-scout-green" />
        <h2 className="text-sm text-scout-text">
          Ranking de Jogadores
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        {estatistica?.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-scout-card-hover ${i < estatistica.length - 1 ? "border-b border-scout-border" : ""}`}
          >
            {/* Rank badge */}
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${i === 0 ? "border-scout-meia-border bg-scout-meia-bg text-scout-meia-text" : "border-scout-border bg-scout-card-header text-scout-muted"}`}
            >
              #{i + 1}
            </span>

            <span className="flex-1 text-sm text-scout-text">
              Jogador#{p.idJogador}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-scout-dim">Nota </span>
              <span className="text-scout-text">{p.nota}</span>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingJogadores;

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PartidaComEventosJogador } from "@/types/jogador";

import { AggregateStatCard } from "./AggregateStatCard";
import GeralTab from "./GeralTab";
import HistoricTab from "./HistoricTab";

interface PlayerInfo {
  perfil: {
    nome: string;
    idade: number;
    numero: number;
    posicao:
      | "Goleiro"
      | "Zagueiro"
      | "Lateral"
      | "Volante"
      | "Meia"
      | "Atacante";
  };
  eventos: {
    gols: number;
    golsContra: number;
    assistencias: number;
    desarmes: number;
    faltasCometidas: number;
    faltasSofridas: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    penaltisCometidos: number;
    penaltisSofridos: number;
  };
  totalPartidas: number;
  nota: number;
}

export const TabContainer = ({
  playerInfo,
  matchs,
}: {
  playerInfo: PlayerInfo;
  matchs: PartidaComEventosJogador[];
}) => {
  const [activeTab, setActiveTab] = useState<
    "geral" | "estatisticas" | "historico"
  >("geral");

  const hasMatches = playerInfo.totalPartidas > 0;
  const displayRating = hasMatches ? playerInfo.nota : "—";
  const aggregateStats = playerInfo.eventos;
  const aggregateItems = [
    { label: "Assistências", value: aggregateStats.assistencias },
    { label: "Desarmes", value: aggregateStats.desarmes },
    { label: "Faltas", value: aggregateStats.faltasCometidas },
  ];
  return (
    <div>
      <div className="border-border mt-6 flex justify-center gap-8 border-b md:justify-start">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("geral")}
          className={`pb-3 text-sm transition-colors md:text-base ${
            activeTab === "geral"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          GERAL
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("estatisticas")}
          className={`pb-3 text-sm transition-colors md:text-base ${
            activeTab === "estatisticas"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          ESTATÍSTICAS
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("historico")}
          className={`pb-3 text-sm transition-colors md:text-base ${
            activeTab === "historico"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          HISTÓRICO
        </Button>
      </div>

      {/* Content */}
      <div className="max-h-125 overflow-y-auto p-6 pt-4 md:max-h-150 md:p-8">
        {activeTab === "geral" && (
          <GeralTab
            geralHistoric={playerInfo}
            displayRating={displayRating}
            hasMatches={hasMatches}
          />
        )}

        {activeTab === "estatisticas" && (
          <div className="space-y-4">
            <p className="text-muted-foreground mb-3 text-xs md:mb-4 md:text-sm">
              ESTATÍSTICAS TOTAIS
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
              {aggregateItems.map((item) => (
                <AggregateStatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "historico" && <HistoricTab matchs={matchs} />}
      </div>
    </div>
  );
};

"use client";

import { Bookmark, ChevronLeft, CircleUserRound, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AggregateStatCard } from "./AggregateStatCard";
import { MatchStatRow } from "./MatchStatRow";

interface MatchStats {
  finalizacaoCerta: number;
  finalizacaoErrada: number;
  assistencias: number;
  dribleCerto: number;
  dribleErrado: number;
  cruzamentos: number;
  interceptacoes: number;
  ganhoBola: number;
  perdaBola: number;
  faltas: number;
}

interface Match {
  id: number;
  opponent: string;
  date: string;
  result: string;
  goals: number;
  rating: number;
  stats: MatchStats;
}

interface PlayerStats {
  totalGols: string;
  totalPartidas: number;
  totalFinalizacoesCertas: string;
  totalFinalizacoesErradas: string;
  totalAssistencias: string;
  totalDriblesCertos: string;
  totalDriblesErrados: string;
  totalCruzamentos: string;
  totalDesarmes: string;
  totalInterceptacoes: string;
  totalGanhoBola: string;
  totalPerdaBola: string;
  totalFaltas: string;
  totalNota: string;
}

export type PlayerDashboardPlayer = {
  nome: string;
  posicao: string;
  idade: number;
  numero: number;
  stats: PlayerStats;
  matchHistory: Match[];
};

interface PlayerDashboardProps {
  player: PlayerDashboardPlayer;
}

function renderStars(rating: number) {
  const normalizedRating = Math.min(Math.max((rating / 10) * 5, 0), 5);
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = Math.max(5 - fullStars - (hasHalfStar ? 1 : 0), 0);

  return (
    <div className="flex items-center justify-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="fill-primary text-primary h-3 w-3" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="text-primary h-3 w-3" />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="fill-primary text-primary h-3 w-3" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-primary/40 h-3 w-3" />
      ))}
    </div>
  );
}

export function PlayerDashboard({ player }: PlayerDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "geral" | "estatisticas" | "historico"
  >("geral");

  const hasMatches = player.stats.totalPartidas > 0;
  const displayRating = hasMatches ? player.stats.totalNota : "—";
  const aggregateStats = player.stats;
  const aggregateItems = [
    {
      label: "Finalizações Certas",
      value: aggregateStats.totalFinalizacoesCertas,
    },
    {
      label: "Finalizações Erradas",
      value: aggregateStats.totalFinalizacoesErradas,
    },
    { label: "Assistências", value: aggregateStats.totalAssistencias },
    { label: "Dribles Certos", value: aggregateStats.totalDriblesCertos },
    { label: "Dribles Errados", value: aggregateStats.totalDriblesErrados },
    { label: "Cruzamentos", value: aggregateStats.totalCruzamentos },
    { label: "Interceptações", value: aggregateStats.totalInterceptacoes },
    { label: "Ganho de Bola", value: aggregateStats.totalGanhoBola },
    { label: "Perda de Bola", value: aggregateStats.totalPerdaBola },
    { label: "Faltas", value: aggregateStats.totalFaltas },
  ];

  return (
    <div className="min-h-screen items-center justify-center bg-linear-to-b from-emerald-950 to-black p-4 md:flex md:min-h-[80vh] md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl md:max-w-7xl">
        {/* Header */}
        <div className="relative p-6 pb-4 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Voltar"
              className="text-foreground hover:text-primary"
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Salvar jogador"
              className="text-foreground hover:text-primary"
            >
              <Bookmark className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
          </div>

          {/* Player Info - Desktop Layout */}
          <div className="md:flex md:items-center md:gap-8">
            <div className="mb-4 flex flex-col items-center md:mb-0">
              <div className="relative">
                <div className="border-primary bg-muted h-24 w-24 overflow-hidden rounded-full border-4 md:h-40 md:w-40">
                  <CircleUserRound className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
            {/* Player Name and Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mt-3 text-2xl font-bold text-white md:mt-0 md:text-4xl">
                {player.nome}
              </h1>
              <div className="mt-2 space-y-1 text-xs text-emerald-400 md:text-base">
                {/* <p>{player.team}</p> */}
                <p className="text-primary font-semibold">{player.posicao}</p>
                <p>
                  {player.idade ? `Idade: ${player.idade} anos` : "Idade: —"} |
                  Número: {player.numero}
                </p>
              </div>

              {/* Desktop Quick Stats */}
              <div className="mt-6 hidden gap-4 md:grid md:grid-cols-4">
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Nota Média</p>
                  <p className="text-primary mt-1 text-3xl font-bold">
                    {displayRating}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Gols</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {player.stats.totalGols}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Assistências</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {player.stats.totalAssistencias}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Jogos</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {player.stats.totalPartidas}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
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
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto p-6 pt-4 md:max-h-[600px] md:p-8">
          {activeTab === "geral" && (
            <>
              {/* Mobile Quick Stats */}
              <div className="mb-4 grid grid-cols-2 gap-4 md:hidden">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-800 p-4">
                  <p className="mb-2 text-xs text-zinc-400">Nota Média</p>
                  <p className="text-primary text-5xl font-bold">
                    {displayRating}
                  </p>
                  {hasMatches && <div className="mt-2">{renderStars(8.3)}</div>}
                </div>

                <div className="space-y-2 rounded-2xl bg-zinc-800 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Gols</span>
                    <span className="font-semibold text-white">
                      {player.stats.totalGols}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Assistências</span>
                    <span className="font-semibold text-white">
                      {player.stats.totalAssistencias}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Desarmes</span>
                    <span className="font-semibold text-white">
                      {player.stats.totalDesarmes}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4">
                <p className="mb-3 text-xs text-zinc-400 md:mb-4 md:text-sm">
                  VARIÁVEIS
                </p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
                    <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
                      Cartões
                    </span>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-3 rounded-sm bg-yellow-400 md:h-5 md:w-4"></div>
                        <span className="text-sm font-semibold text-white md:text-base">
                          {1}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="bg-destructive h-4 w-3 rounded-sm md:h-5 md:w-4"></div>
                        <span className="text-sm font-semibold text-white md:text-base">
                          {2}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
                    <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
                      Assistências
                    </span>
                    <span className="text-sm font-semibold text-white md:text-base">
                      {player.stats.totalAssistencias}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
                    <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
                      Finalizações
                    </span>
                    <span className="text-sm font-semibold text-white md:text-base">
                      {player.stats.totalFinalizacoesCertas}
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
                    <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
                      Cruzamentos
                    </span>
                    <span className="text-sm font-semibold text-white md:text-base">
                      {player.stats.totalCruzamentos}
                    </span>
                  </div>
                </div>
              </div>
            </>
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

          {activeTab === "historico" && (
            <div className="space-y-3 md:space-y-4">
              <p className="text-muted-foreground mb-3 text-xs md:mb-4 md:text-sm">
                HISTÓRICO DE PARTIDAS
              </p>
              {player.matchHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhuma partida registrada para este jogador.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {player.matchHistory.map((match) => (
                    <div
                      key={match.id}
                      className="bg-muted space-y-3 rounded-xl p-4 md:p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-foreground text-base font-bold md:text-lg">
                            {match.opponent}
                          </h3>
                          <p className="text-muted-foreground text-xs md:text-sm">
                            {match.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground text-base font-bold md:text-lg">
                            {match.result}
                          </p>
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="text-primary text-sm font-bold md:text-base">
                              {match.rating.toFixed(1)}
                            </span>
                            <Star className="fill-primary text-primary h-3 w-3 md:h-4 md:w-4" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                        {[
                          { label: "Gols", value: match.goals },
                          {
                            label: "Assistências",
                            value: match.stats.assistencias,
                          },
                          {
                            label: "Final. Certas",
                            value: match.stats.finalizacaoCerta,
                          },
                          {
                            label: "Final. Erradas",
                            value: match.stats.finalizacaoErrada,
                          },
                          {
                            label: "Dribles",
                            value: `${match.stats.dribleCerto}/${match.stats.dribleErrado}`,
                          },
                          {
                            label: "Interceptações",
                            value: match.stats.interceptacoes,
                          },
                          { label: "Faltas", value: match.stats.faltas },
                        ].map((item) => (
                          <MatchStatRow
                            key={`${match.id}-${item.label}`}
                            label={item.label}
                            value={item.value}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

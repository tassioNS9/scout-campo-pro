"use client";

import { useSearchParams } from "next/navigation";

import { ChartPieDonut } from "@/components/chart-pie-donut";
import { api } from "@/lib/api-client";

const defaultDashboardData = {
  resumo: {
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
  },
  gerais: {
    posseBola: 0,
    gols: 0,
    assistencias: 0,
    finalizacoes: 0,
    desarmes: 0,
  },
  distribuicaoEventos: {
    gols: 0,
    assistencias: 0,
    finalizacoes: 0,
    desarmes: 0,
  },
} as const;

const legendConfig = [
  { key: "gols", label: "Gols", color: "var(--chart-1)" },
  { key: "assistencias", label: "Assistências", color: "var(--chart-2)" },
  { key: "finalizacoes", label: "Finalizações", color: "var(--chart-3)" },
  { key: "desarmes", label: "Desarmes", color: "var(--chart-4)" },
] as const;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const partidaParam = searchParams.get("partida");
  const idPartida = Number(partidaParam);
  const hasValidPartidaId = Number.isInteger(idPartida) && idPartida > 0;

  const { data, isLoading } = api.dashboard.getByPartida.useQuery(
    { idPartida },
    { enabled: hasValidPartidaId },
  );

  const dashboardData = data ?? defaultDashboardData;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black pb-20 text-white">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          {!hasValidPartidaId ? (
            <p className="text-sm text-slate-300">
              Selecione uma partida para visualizar o dashboard.
            </p>
          ) : isLoading ? (
            <p className="text-sm text-slate-300">
              Carregando dados da partida...
            </p>
          ) : (
            <p className="text-sm text-slate-300">
              Dashboard da partida #{idPartida}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <p className="mb-2 text-sm text-slate-400">Jogos</p>
            <p className="text-primary text-4xl font-black">
              {dashboardData.resumo.jogos}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <p className="mb-2 text-sm text-slate-400">Vitórias</p>
            <p className="text-primary text-4xl font-black">
              {dashboardData.resumo.vitorias}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <p className="mb-2 text-sm text-slate-400">Empates</p>
            <p className="text-primary text-4xl font-black">
              {dashboardData.resumo.empates}
            </p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <p className="mb-2 text-sm text-slate-400">Derrotas</p>
            <p className="text-primary text-4xl font-black">
              {dashboardData.resumo.derrotas}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8">
          <h3 className="mb-6 text-xl font-bold">Estatísticas Gerais</h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <p className="mb-2 text-3xl font-black">
                {dashboardData.gerais.posseBola}%
              </p>
              <p className="text-sm text-slate-400">Posse de Bola</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-3xl font-black">
                {dashboardData.gerais.gols}
              </p>
              <p className="text-sm text-slate-400">Gols</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-3xl font-black">
                {dashboardData.gerais.assistencias}
              </p>
              <p className="text-sm text-slate-400">Assistências</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-3xl font-black">
                {dashboardData.gerais.finalizacoes}
              </p>
              <p className="text-sm text-slate-400">Finalizações</p>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h3 className="mb-6 text-xl font-bold">Distribuição de Eventos</h3>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <ChartPieDonut data={dashboardData.distribuicaoEventos} />

            <div className="space-y-4">
              {legendConfig.map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">
                    {item.label}: {dashboardData.distribuicaoEventos[item.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

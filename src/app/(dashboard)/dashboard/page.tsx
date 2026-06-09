"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChartPieDonut } from "@/components/chart-pie-donut";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboardByPartida } from "@/app/actions/get-dashboard-by-partida";
import { listPartidas } from "@/app/actions/list-partidas";
import type { DashboardByPartidaData } from "@/db/queries";
import type { Partida } from "@/db/schema";

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
  const [idPartida, setIdPartida] = useState<string>(partidaParam ?? "");
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [dashboard, setDashboard] = useState<DashboardByPartidaData | null>(
    null,
  );
  const numericIdPartida = Number(idPartida);
  const hasValidPartidaId =
    Number.isInteger(numericIdPartida) && numericIdPartida > 0;

  useEffect(() => {
    let isMounted = true;
    listPartidas().then((data) => {
      if (isMounted) {
        setPartidas(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!hasValidPartidaId) {
      setDashboard(null);
      return;
    }
    getDashboardByPartida(numericIdPartida).then((data) => {
      if (isMounted) {
        setDashboard(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [hasValidPartidaId, numericIdPartida]);

  const dashboardData = dashboard ?? defaultDashboardData;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black pb-20 text-white">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Partida
            </label>
            <Select value={idPartida} onValueChange={setIdPartida}>
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Selecione uma partida" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {partidas?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    Partida #{p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

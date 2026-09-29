"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getResumoByPartida } from "@/app/actions/get-resumo-by-partida";
import { listPartidas } from "@/app/actions/list-partidas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Partida } from "@/db/queries";

import { ChartPieDonut } from "./components/chart-pie-donut";

const legendConfig = [
  { key: "gols", label: "Gols", color: "var(--chart-1)" },
  { key: "assistencias", label: "Assistências", color: "var(--chart-2)" },
  { key: "faltas", label: "Faltas", color: "var(--chart-3)" },
  { key: "desarmes", label: "Desarmes", color: "var(--chart-4)" },
] as const;

export default function DashboardPage() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [idPartida, setIdPartida] = useState<number | null>(null);
  const [loadingPartidas, setLoadingPartidas] = useState<boolean>(false);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);

  const [dashboard, setDashboard] = useState({
    gols: 0,
    assistencias: 0,
    faltas: 0,
    desarmes: 0,
    totalEventos: 0,
  });

  // 1. Carrega partidas uma vez
  useEffect(() => {
    const fetchPartidas = async () => {
      setLoadingPartidas(true);
      try {
        const partidasData = await listPartidas();
        setPartidas(partidasData);
        setIdPartida(partidasData[0]?.id ?? null);
      } catch {
        toast.error("Erro ao carregar a lista de partidas");
      } finally {
        setLoadingPartidas(false);
      }
    };
    fetchPartidas();
  }, []);

  // 2. Carrega dashboard sempre que idPartida mudar (e só quando definido)
  useEffect(() => {
    if (idPartida == null) return; // evita fetch com id inválido

    let ignore = false; // guarda contra race condition

    const fetchDashboardData = async () => {
      setLoadingDashboard(true);
      try {
        const data = await getResumoByPartida(idPartida);
        if (!ignore) setDashboard(data);
      } catch {
        if (!ignore) toast.error("Erro ao carregar os dados do dashboard");
      } finally {
        if (!ignore) setLoadingDashboard(false);
      }
    };

    fetchDashboardData();

    return () => {
      ignore = true; // se idPartida mudar de novo antes da resposta, ignora a resposta antiga
    };
  }, [idPartida]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-black pb-20 text-white">
      {idPartida === null ? (
        <div className="flex h-screen items-center justify-center">
          <p className="text-lg text-slate-400">
            Primeiro, crie uma partida para visualizar o dashboard.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Selecionar Partida
              </label>
              <Select
                value={idPartida?.toString() || ""}
                onValueChange={(value) => setIdPartida(Number(value))}
              >
                <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                  <SelectValue placeholder="Selecione uma partida" />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  {partidas?.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.nomeTime.slice(0, 10)} x {p.nomeTimeAdversario} -{" "}
                      {new Date(p.data).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-border/80 rounded-xl border p-8 shadow-sm">
            <h3 className="text-background mb-6 text-xl">
              Estatísticas Gerais
            </h3>
            <Separator className="bg-border/70 mb-6" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <p className="text-primary mb-2 text-3xl font-bold">8</p>
                <p className="text-muted-foreground text-sm">Jogos</p>
              </div>
              <div className="text-center">
                <p className="text-chart-2 mb-2 text-3xl font-bold">5</p>
                <p className="text-muted-foreground text-sm">Vitórias</p>
              </div>
              <div className="text-center">
                <p className="text-chart-4 mb-2 text-3xl font-bold">2</p>
                <p className="text-muted-foreground text-sm">Empates</p>
              </div>
              <div className="text-center">
                <p className="text-destructive mb-2 text-3xl font-bold">1</p>
                <p className="text-muted-foreground text-sm">Derrotas</p>
              </div>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-6 text-xl font-bold">
              Distribuição de Eventos por partida
            </h3>
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
              <div className="w-full md:w-1/2">
                <ChartPieDonut data={dashboard} />
              </div>
              <div className="space-y-4">
                {legendConfig.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.label}: {dashboard[item.key]}
                    </span>
                  </div>
                ))}
                <div className="text-muted-foreground mt-4 text-sm">
                  Total de eventos: {dashboard?.totalEventos || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

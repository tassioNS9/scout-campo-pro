"use client";

import { FileDown, FileText } from "lucide-react";
import { useState, useTransition } from "react";
import { useRef } from "react";

import { getHistoricoEventosByPartida } from "@/app/actions/get-historico-eventos-by-partida";
import { getResumoByPartida } from "@/app/actions/get-resumo-by-partida";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Partida } from "@/db/queries";
import { exportToPdf } from "@/utils/exportPDF";

import AnaliseTextual from "./AnaliseTextual";
import HistoricoEventos from "./HistoricoEventos";
import RankingJogadores from "./RankingJogadores";
import ResumoPartida from "./ResumoPartida";
import SeletorPartida from "./SeletorPartida";

type PartidaData = Awaited<ReturnType<typeof getHistoricoEventosByPartida>>;
type ResumoPartidaData = Awaited<ReturnType<typeof getResumoByPartida>>;

const RelatorioPartida = ({ partidas }: { partidas: Partida[] }) => {
  const [partidaData, setPartidaData] = useState<PartidaData | null>(null);
  const [resumoPartidaData, setResumoPartidaData] =
    useState<ResumoPartidaData | null>(null);
  const [partidaIdSelecionada, setPartidaIdSelecionada] = useState<
    number | null
  >(null);
  const [, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const relatorioRef = useRef<HTMLDivElement>(null);

  const handleSelecionarPartida = (partidaId: number | null) => {
    setPartidaIdSelecionada(partidaId);
    setErro(null);

    if (partidaId === null) {
      setPartidaData(null);
      return;
    }

    startTransition(async () => {
      try {
        const [data, dataGeral] = await Promise.all([
          getHistoricoEventosByPartida({ partidaId }),
          getResumoByPartida(partidaId),
        ]);

        setPartidaData(data);
        setResumoPartidaData(dataGeral);
      } catch {
        setErro("Não foi possível carregar a partida.");
        setPartidaData(null);
        setResumoPartidaData(null);
      }
    });
  };
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <BackButton />
        <div className="flex items-center gap-2">
          <div className="border-scout-green-border bg-scout-green-dim shrink-0 rounded-lg border p-2">
            <FileText size={18} className="text-scout-green" />
          </div>
          <div>
            <button
              onClick={() => exportToPdf(relatorioRef.current)}
              className="bg-scout-green text-scout-bg hover:bg-scout-green/90 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm"
            >
              <FileDown size={15} />
              Gerar PDF do Relatório
            </button>
          </div>
          <div>
            <h1 className="text-scout-text text-lg leading-tight">
              Relatórios de Partida
            </h1>
          </div>
        </div>
      </div>

      {/* Match selector */}
      <SeletorPartida
        partidas={partidas}
        partidaIdSelecionada={partidaIdSelecionada}
        onSelect={handleSelecionarPartida}
      />

      {!partidaIdSelecionada ? (
        <Card className="border-scout-border bg-scout-card mt-6 py-12 text-center">
          <CardContent>
            <p className="text-scout-muted">
              Selecione uma partida para visualizar o relatório
            </p>
          </CardContent>
        </Card>
      ) : isPending ? (
        <Card className="border-scout-border bg-scout-card mt-6 py-12 text-center">
          <CardContent>
            <p className="text-scout-muted">Carregando relatório...</p>
          </CardContent>
        </Card>
      ) : (
        <div ref={relatorioRef}>
          <div className="mt-6 mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Resumo da Partida */}
            <ResumoPartida match={resumoPartidaData} />

            {/* Ranking de Jogadores */}
            <RankingJogadores estatistica={partidaData?.estatisticas} />
          </div>

          {/* ── Row 2: Análise ── */}
          <AnaliseTextual />

          {/* ── Row 3: Histórico de Eventos ── */}
          <HistoricoEventos eventos={partidaData?.eventos ?? []} />
        </div>
      )}

      {/* ── Row 1: Resumo + Ranking ── */}
    </div>
  );
};

export default RelatorioPartida;

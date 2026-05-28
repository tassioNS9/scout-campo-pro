"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { listEstatisticasByPartida } from "@/app/actions/list-estatisticas-by-partida";
import { listEventosByPartida } from "@/app/actions/list-eventos-by-partida";
import { listPartidas } from "@/app/actions/list-partidas";
import { listTimes } from "@/app/actions/list-times";
import type { Estatistica, Evento, Partida, Time } from "@/db/schema";

function normalizePdfText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?");
}

function escapePdfText(value: string) {
  return normalizePdfText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function createSimplePdf(lines: string[]) {
  const linesPerPage = 48;
  const safeLines = lines.map(escapePdfText);
  const chunks: string[][] = [];

  for (let i = 0; i < safeLines.length; i += linesPerPage) {
    chunks.push(safeLines.slice(i, i + linesPerPage));
  }

  if (chunks.length === 0) {
    chunks.push(["Relatorio sem conteudo."]);
  }

  const catalogObj = 1;
  const pagesObj = 2;
  const fontObj = 3;
  const objectMap: Record<number, string> = {
    [catalogObj]: `${catalogObj} 0 obj\n<< /Type /Catalog /Pages ${pagesObj} 0 R >>\nendobj\n`,
    [fontObj]: `${fontObj} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
  };

  const pageObjectIds: number[] = [];
  chunks.forEach((chunk, index) => {
    const pageObj = 4 + index * 2;
    const contentObj = pageObj + 1;
    pageObjectIds.push(pageObj);

    const contentStream = [
      "BT",
      "/F1 11 Tf",
      "14 TL",
      "40 800 Td",
      ...chunk.flatMap((line) => [`(${line}) Tj`, "T*"]),
      "ET",
    ].join("\n");

    objectMap[pageObj] =
      `${pageObj} 0 obj\n` +
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObj} 0 R >> >> /Contents ${contentObj} 0 R >>\n` +
      "endobj\n";
    objectMap[contentObj] =
      `${contentObj} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n` +
      `${contentStream}\nendstream\nendobj\n`;
  });

  objectMap[pagesObj] =
    `${pagesObj} 0 obj\n<< /Type /Pages /Kids [` +
    pageObjectIds.map((id) => `${id} 0 R`).join(" ") +
    `] /Count ${pageObjectIds.length} >>\nendobj\n`;

  const objectCount = Math.max(...Object.keys(objectMap).map(Number));

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let i = 1; i <= objectCount; i++) {
    const object = objectMap[i];
    offsets.push(pdf.length);
    pdf += object;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objectCount + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objectCount; i++) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function RelatoriosContent() {
  const searchParams = useSearchParams();
  const partidaParam = searchParams.get("partida");

  const [idPartida, setIdPartida] = useState<string>(partidaParam ?? "");
  const [analise, setAnalise] = useState("");
  const [sugestoes, setSugestoes] = useState("");
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([listPartidas(), listTimes()]).then(
      ([partidasData, timesData]) => {
        if (isMounted) {
          setPartidas(partidasData);
          setTimes(timesData);
        }
      },
    );
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const numericId = Number(idPartida);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setEstatisticas([]);
      setEventos([]);
      return;
    }
    setIsLoadingDetalhes(true);
    Promise.all([
      listEstatisticasByPartida(numericId),
      listEventosByPartida(numericId),
    ])
      .then(([estatisticasData, eventosData]) => {
        if (isMounted) {
          setEstatisticas(estatisticasData);
          setEventos(eventosData);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingDetalhes(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [idPartida]);

  const getTimeName = (id: number | string) => {
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      return times.find((t) => t.id === numericId)?.nome ?? `Time #${id}`;
    }
    return typeof id === "string" ? id : `Time #${id}`;
  };

  const getPartidaLabel = (p: Partida) => {
    return `${getTimeName(p.time)} × ${getTimeName(p.timeAdversario)}`;
  };

  const formatDate = (value: Date) => {
    return new Date(value).toLocaleString("pt-BR");
  };

  const handleSaveRelatorio = () => {
    if (!idPartida) {
      toast.error("Selecione uma partida");
      return;
    }

    const partidaSelecionada = partidas?.find(
      (p) => p.id === parseInt(idPartida),
    );
    if (!partidaSelecionada) {
      toast.error("Partida não encontrada");
      return;
    }

    const ranking = estatisticas.slice(0, 5);
    const linhasEventos = eventos.map((evento) => {
      const zona = evento.zona ? ` - Zona: ${evento.zona}` : "";
      return `${evento.tempo} ${evento.minuto}' - ${evento.tipoEvento} (Jogador #${evento.idJogador})${zona}`;
    });

    const linhas = [
      "RELATORIO DE PARTIDA",
      "",
      `Partida #${partidaSelecionada.id}`,
      `Confronto: ${getTimeName(partidaSelecionada.time)} x ${getTimeName(partidaSelecionada.timeAdversario)}`,
      `Data: ${formatDate(partidaSelecionada.data)}`,
      `Placar: ${partidaSelecionada.placarTimeA ?? 0} x ${partidaSelecionada.placarTimeB ?? 0}`,
      "",
      "RESUMO",
      `Gols: ${totalGols}`,
      `Finalizacoes: ${totalFinalizacoes}`,
      `Desarmes: ${totalDesarmes}`,
      `Dribles: ${totalDribles}`,
      `Total de eventos: ${totalEventos}`,
      "",
      "ANALISE",
      analise.trim() || "Sem analise informada.",
      "",
      "SUGESTOES TATICAS",
      sugestoes.trim() || "Sem sugestoes informadas.",
      "",
      "RANKING DE JOGADORES",
      ...(ranking.length > 0
        ? ranking.map(
            (stat, index) =>
              `#${index + 1} Jogador #${stat.idJogador} - Gols: ${stat.gols ?? 0} - Assist.: ${stat.assistencias ?? 0} - Nota: ${stat.nota}`,
          )
        : ["Sem estatisticas registradas."]),
      "",
      "HISTORICO DE EVENTOS",
      ...(linhasEventos.length > 0
        ? linhasEventos
        : ["Nenhum evento registrado para esta partida."]),
    ];

    const pdfContent = createSimplePdf(linhas);
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-partida-${partidaSelecionada.id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("PDF gerado com sucesso");
  };

  // Calcular estatísticas agregadas
  const totalGols = eventos.filter((e) => e.tipoEvento === "Gol").length;
  const totalFinalizacoes = eventos.filter(
    (e) =>
      e.tipoEvento === "Finalização Certa" ||
      e.tipoEvento === "Finalização Errada",
  ).length;
  const totalDesarmes = eventos.filter(
    (e) => e.tipoEvento === "Desarme",
  ).length;
  const totalDribles = eventos.filter(
    (e) => e.tipoEvento === "Drible Certo",
  ).length;
  const totalEventos = eventos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Relatórios de Partida
          </h1>
          <div className="max-w-xs">
            <Select value={idPartida} onValueChange={setIdPartida}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma partida" />
              </SelectTrigger>
              <SelectContent>
                {partidas.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {getPartidaLabel(p)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!idPartida ? (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-slate-600">
                Selecione uma partida para visualizar o relatório
              </p>
            </CardContent>
          </Card>
        ) : isLoadingDetalhes ? (
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-slate-600">Carregando relatório...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Resumo de Eventos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resumo da Partida
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <p className="text-sm text-slate-600">Gols</p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {totalGols}
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
                    <p className="text-sm text-slate-600">Finalizações</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {totalFinalizacoes}
                    </p>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-center">
                    <p className="text-sm text-slate-600">Desarmes</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {totalDesarmes}
                    </p>
                  </div>
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <p className="text-sm text-slate-600">Dribles</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {totalDribles}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-600">Total de Eventos</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalEventos}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ranking de Jogadores */}
            <Card>
              <CardHeader>
                <CardTitle>Ranking de Jogadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {estatisticas?.slice(0, 5).map((stat, index) => (
                    <div
                      key={stat.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500">
                          #{index + 1}
                        </span>
                        <span className="font-medium">
                          Jogador #{stat.idJogador}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">
                          {stat.gols ?? 0} gols
                        </span>
                        <span className="text-sm text-slate-600">
                          {stat.assistencias ?? 0} assist.
                        </span>
                        <span className="font-bold text-emerald-600">
                          {stat.nota}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!estatisticas || estatisticas.length === 0) && (
                    <p className="py-4 text-center text-slate-500">
                      Nenhuma estatística registrada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Análise Textual */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Análise e Sugestões</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="analise">Análise da Partida</Label>
                  <Textarea
                    id="analise"
                    value={analise}
                    onChange={(e) => setAnalise(e.target.value)}
                    placeholder="Descreva a análise geral da partida..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="sugestoes">Sugestões Táticas</Label>
                  <Textarea
                    id="sugestoes"
                    value={sugestoes}
                    onChange={(e) => setSugestoes(e.target.value)}
                    placeholder="Descreva as sugestões táticas para próximas partidas..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={handleSaveRelatorio}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Gerar PDF do Relatório
                </Button>
              </CardContent>
            </Card>

            {/* Lista de Eventos */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Histórico de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-80 space-y-2 overflow-y-auto">
                  {eventos?.map((evento) => (
                    <div
                      key={evento.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-slate-200 px-2 py-1 font-mono text-xs">
                          {evento.tempo} {evento.minuto}&apos;
                        </span>
                        <span className="font-medium text-slate-900">
                          {evento.tipoEvento}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {evento.zona && (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            {evento.zona}
                          </span>
                        )}
                        <span className="text-sm text-slate-600">
                          Jogador #{evento.idJogador}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!eventos || eventos.length === 0) && (
                    <p className="py-4 text-center text-slate-500">
                      Nenhum evento registrado para esta partida
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Carregando...
        </div>
      }
    >
      <RelatoriosContent />
    </Suspense>
  );
}

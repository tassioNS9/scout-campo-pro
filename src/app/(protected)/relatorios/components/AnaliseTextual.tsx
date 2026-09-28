import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Estatistica, Evento } from "@/db/schema";

interface Partida {
  id: string;
  data: Date;
  idTime: number;
  nomeTime: string;
  nomeTimeAdversario: string;
  placarTime: number | null;
  placarTimeAdversario: number | null;
  status: string;
  resultado: string;
  campeonato: string;
  categoria: string;
}

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

const AnaliseTextual = () => {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const getTimeName = (id: number | string) => {
    if (!Number.isNaN(id)) {
      return times.find((t) => t.id === id)?.nome ?? `${id}`;
    }
    return typeof id === "string" ? id : `${id}`;
  };

  const getPartidaLabel = (p: Partida) => {
    return `${getTimeName(p.nomeTime)} × ${getTimeName(p.nomeTimeAdversario)}  ${new Date(p.data).toLocaleDateString("pt-BR")}`;
  };

  const formatDate = (value: Date) => {
    return new Date(value).toLocaleString("pt-BR");
  };

  const handleSaveRelatorio = () => {
    if (!idPartida) {
      toast.error("Selecione uma partida");
      return;
    }

    const partidaSelecionada = partidas?.find((p) => p.id === idPartida);
    if (!partidaSelecionada) {
      toast.error("Partida não encontrada");
      return;
    }

    const ranking = estatisticas.slice(0, 5);
    const linhasEventos = eventos.map((evento) => {
      console.log(evento, "evento");
      const zona = evento.zona ? ` - Zona: ${evento.zona}` : "";
      return `${evento.tempo} ${evento.minuto}' - ${evento.tipoEvento} (Jogador #${evento.idJogador})${zona}`;
    });

    const linhas = [
      "RELATORIO DE PARTIDA",
      "",
      `Partida #${partidaSelecionada.id}`,
      `Confronto: ${getTimeName(partidaSelecionada.nomeTime)} x ${getTimeName(partidaSelecionada.nomeTimeAdversario)}`,
      `Data: ${formatDate(partidaSelecionada.data)}`,
      `Placar: ${partidaSelecionada.placarTime ?? 0} x ${partidaSelecionada.placarTimeAdversario ?? 0}`,
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
  const [analise, setAnalise] = useState("");
  const [sugestoes, setSugestoes] = useState("");
  return (
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
  );
};

export default AnaliseTextual;

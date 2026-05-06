"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const EVENTOS = [
  "Finalização Certa",
  "Finalização Errada",
  "Assistência",
  "Passe Decisivo",
  "Drible Certo",
  "Drible Errado",
  "Cruzamento",
  "Desarme",
  "Interceptação",
  "Ganho de Bola",
  "Perda de Bola",
  "Falta",
  "Duelo Ganho",
  "Duelo Perdido",
  "Gol",
];

function ScoutContent() {
  const searchParams = useSearchParams();
  const partidaParam = searchParams.get("partida");

  const [idPartida, setIdPartida] = useState<string>(partidaParam ?? "");
  const [idJogador, setIdJogador] = useState<string>("");
  const [tempo, setTempo] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tempoAtual, setTempoAtual] = useState<"1T" | "2T">("1T");
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [zona, setZona] = useState<"Defesa" | "Meio" | "Ataque">("Meio");
  const [partidaFinalizadaManual, setPartidaFinalizadaManual] = useState(false);

  const { data: partidas } = api.partidas.list.useQuery();
  const { data: partida } = api.partidas.getById.useQuery(
    { id: parseInt(idPartida) || 0 },
    { enabled: !!idPartida },
  );
  const { data: jogadores } = api.jogadores.listByTime.useQuery(
    { idTime: partida?.timeA ?? 0 },
    { enabled: !!partida?.timeA },
  );
  const { data: times } = api.times.list.useQuery();

  const createEventoMutation = api.eventos.create.useMutation();
  const updatePartidaMutation = api.partidas.update.useMutation();
  const isPartidaFinalizada =
    partidaFinalizadaManual || partida?.status === "finalizada";

  // Sync placar from partida data
  useEffect(() => {
    if (partida) {
      setPlacarA(partida.placarTimeA ?? 0);
      setPlacarB(partida.placarTimeB ?? 0);
    }
  }, [partida]);

  useEffect(() => {
    setPartidaFinalizadaManual(false);
  }, [idPartida]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTempo((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeName = (id: number) => {
    return times?.find((t) => t.id === id)?.nome ?? `Time #${id}`;
  };

  const handleEvento = async (tipoEvento: string) => {
    if (isPartidaFinalizada) {
      toast.error("A partida já foi finalizada");
      return;
    }
    if (!idPartida || !idJogador) {
      toast.error("Selecione a partida e o jogador");
      return;
    }
    try {
      await createEventoMutation.mutateAsync({
        idPartida: parseInt(idPartida),
        idJogador: parseInt(idJogador),
        tipoEvento: tipoEvento as Parameters<
          typeof createEventoMutation.mutateAsync
        >[0]["tipoEvento"],
        minuto: Math.floor(tempo / 60),
        tempo: tempoAtual,
        zona,
      });
      toast.success(`${tipoEvento} registrado`);
    } catch {
      toast.error("Erro ao registrar evento");
    }
  };

  const handleGol = async (time: "A" | "B") => {
    if (isPartidaFinalizada) {
      toast.error("A partida já foi finalizada");
      return;
    }
    if (!idPartida) {
      toast.error("Selecione a partida");
      return;
    }
    const novoA = time === "A" ? placarA + 1 : placarA;
    const novoB = time === "B" ? placarB + 1 : placarB;
    setPlacarA(novoA);
    setPlacarB(novoB);
    try {
      await updatePartidaMutation.mutateAsync({
        id: parseInt(idPartida),
        placarTimeA: novoA,
        placarTimeB: novoB,
      });
      if (idJogador) {
        await handleEvento("Gol");
      }
    } catch {
      toast.error("Erro ao registrar gol");
    }
  };

  const handleFinalizarPartida = async () => {
    if (isPartidaFinalizada) {
      toast.error("A partida já foi finalizada");
      return;
    }
    if (!idPartida) {
      toast.error("Selecione a partida");
      return;
    }
    try {
      await updatePartidaMutation.mutateAsync({
        id: parseInt(idPartida),
        placarTimeA: placarA,
        placarTimeB: placarB,
        status: "finalizada",
      });
      setIsRunning(false);
      setPartidaFinalizadaManual(true);
      toast.success("Partida finalizada com sucesso");
    } catch {
      toast.error("Erro ao finalizar partida");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Selection Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Partida
            </label>
            <Select value={idPartida} onValueChange={setIdPartida}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione uma partida" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {partidas?.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    Partida #{p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Jogador
            </label>
            <Select value={idJogador} onValueChange={setIdJogador}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Selecione um jogador" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {jogadores?.map((j) => (
                  <SelectItem key={j.id} value={j.id.toString()}>
                    #{j.numero} - {j.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600 p-8 mb-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Time A */}
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Time A</div>
              <div className="flex items-center gap-2 justify-center">
                <Button
                  size="sm"
                  onClick={() => setPlacarA(Math.max(0, placarA - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isPartidaFinalizada}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-6xl font-bold text-blue-400 min-w-[100px] text-center">
                  {placarA}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleGol("A")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isPartidaFinalizada}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Timer and Period */}
            <div className="text-center">
              <div className="text-6xl font-bold text-green-500 font-mono mb-4">
                {formatTime(tempo)}
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <Button
                  size="sm"
                  variant={tempoAtual === "1T" ? "default" : "outline"}
                  onClick={() => setTempoAtual("1T")}
                  className={
                    tempoAtual === "1T"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }
                  disabled={isPartidaFinalizada}
                >
                  1T
                </Button>
                <Button
                  size="sm"
                  variant={tempoAtual === "2T" ? "default" : "outline"}
                  onClick={() => setTempoAtual("2T")}
                  className={
                    tempoAtual === "2T"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-slate-700 hover:bg-slate-600"
                  }
                  disabled={isPartidaFinalizada}
                >
                  2T
                </Button>
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                  disabled={isPartidaFinalizada}
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setTempo(0)}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                  disabled={isPartidaFinalizada}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Time B */}
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Time B</div>
              <div className="flex items-center gap-2 justify-center">
                <Button
                  size="sm"
                  onClick={() => setPlacarB(Math.max(0, placarB - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isPartidaFinalizada}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-6xl font-bold text-yellow-400 min-w-[100px] text-center">
                  {placarB}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleGol("B")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isPartidaFinalizada}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Zona de Campo */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Zona de Campo</h3>
          <div className="flex gap-4">
            <Button
              onClick={() => setZona("Defesa")}
              className={`flex-1 ${zona === "Defesa" ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 hover:bg-slate-600"} text-white`}
              disabled={isPartidaFinalizada}
            >
              Defesa
            </Button>
            <Button
              onClick={() => setZona("Meio")}
              className={`flex-1 ${zona === "Meio" ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 hover:bg-slate-600"} text-white`}
              disabled={isPartidaFinalizada}
            >
              Meio
            </Button>
            <Button
              onClick={() => setZona("Ataque")}
              className={`flex-1 ${zona === "Ataque" ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 hover:bg-slate-600"} text-white`}
              disabled={isPartidaFinalizada}
            >
              Ataque
            </Button>
          </div>
        </Card>

        {/* Eventos */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-6">
            Registrar Eventos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {EVENTOS.map((evento) => (
              <Button
                key={evento}
                onClick={() => handleEvento(evento)}
                className="bg-slate-700 hover:bg-slate-600 text-white text-xs h-auto py-3 flex flex-col items-center gap-1"
                disabled={isPartidaFinalizada}
              >
                {evento}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="flex gap-4 mt-8 pb-8">
          <Button
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-6"
            disabled={isPartidaFinalizada}
          >
            Pausar Partida
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6"
            onClick={handleFinalizarPartida}
            disabled={isPartidaFinalizada || updatePartidaMutation.isPending}
          >
            Finalizar Partida
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ScoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <ScoutContent />
    </Suspense>
  );
}

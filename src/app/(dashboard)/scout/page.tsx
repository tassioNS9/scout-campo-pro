"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { createEvento } from "@/app/actions/create-evento";
import { getPartidaById } from "@/app/actions/get-partida-by-id";
import { listJogadoresByTime } from "@/app/actions/list-jogadores-by-time";
import { listPartidas } from "@/app/actions/list-partidas";
import { updatePartida } from "@/app/actions/update-partida";
import type { InsertEvento, Jogador, Partida } from "@/db/schema";

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
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [partida, setPartida] = useState<Partida | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [isUpdatingPartida, setIsUpdatingPartida] = useState(false);
  const isPartidaFinalizada =
    partidaFinalizadaManual || partida?.status === "finalizada";

  useEffect(() => {
    let isMounted = true;
    listPartidas().then((partidasData) => {
      if (isMounted) {
        setPartidas(partidasData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const numericId = Number(idPartida);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setPartida(null);
      return;
    }
    getPartidaById(numericId).then((data) => {
      if (isMounted) {
        setPartida(data ?? null);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [idPartida]);

  useEffect(() => {
    let isMounted = true;
    const timeId = Number(partida?.time);
    if (!Number.isInteger(timeId) || timeId <= 0) {
      setJogadores([]);
      return;
    }
    listJogadoresByTime(timeId).then((data) => {
      if (isMounted) {
        setJogadores(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [partida?.time]);

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
      await createEvento({
        idPartida: parseInt(idPartida),
        idJogador: parseInt(idJogador),
        tipoEvento: tipoEvento as InsertEvento["tipoEvento"],
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
      setIsUpdatingPartida(true);
      await updatePartida({
        id: parseInt(idPartida),
        placarTimeA: novoA,
        placarTimeB: novoB,
      });
      if (idJogador) {
        await handleEvento("Gol");
      }
    } catch {
      toast.error("Erro ao registrar gol");
    } finally {
      setIsUpdatingPartida(false);
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
      setIsUpdatingPartida(true);
      await updatePartida({
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
    } finally {
      setIsUpdatingPartida(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Selection Row */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Partida
            </label>
            <Select value={idPartida} onValueChange={setIdPartida}>
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Selecione uma partida" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {partidas.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    Partida #{p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Jogador
            </label>
            <Select value={idJogador} onValueChange={setIdJogador}>
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Selecione um jogador" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {jogadores.map((j) => (
                  <SelectItem key={j.id} value={j.id.toString()}>
                    #{j.numero} - {j.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="mb-8 rounded-lg border border-slate-600 bg-gradient-to-r from-slate-800 to-slate-700 p-8">
          <div className="grid grid-cols-3 items-center gap-8">
            {/* Time A */}
            <div className="text-center">
              <div className="mb-2 text-sm text-slate-400">Time A</div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setPlacarA(Math.max(0, placarA - 1))}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={isPartidaFinalizada}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[100px] text-center text-6xl font-bold text-blue-400">
                  {placarA}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleGol("A")}
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={isPartidaFinalizada}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Timer and Period */}
            <div className="text-center">
              <div className="mb-4 font-mono text-6xl font-bold text-green-500">
                {formatTime(tempo)}
              </div>
              <div className="mb-4 flex justify-center gap-2">
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
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setTempo(0)}
                  className="bg-slate-600 text-white hover:bg-slate-700"
                  disabled={isPartidaFinalizada}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Time B */}
            <div className="text-center">
              <div className="mb-2 text-sm text-slate-400">Time B</div>
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setPlacarB(Math.max(0, placarB - 1))}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={isPartidaFinalizada}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[100px] text-center text-6xl font-bold text-yellow-400">
                  {placarB}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleGol("B")}
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={isPartidaFinalizada}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Zona de Campo */}
        <Card className="mb-8 border-slate-700 bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-bold text-white">Zona de Campo</h3>
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
        <Card className="border-slate-700 bg-slate-800 p-6">
          <h3 className="mb-6 text-lg font-bold text-white">
            Registrar Eventos
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {EVENTOS.map((evento) => (
              <Button
                key={evento}
                onClick={() => handleEvento(evento)}
                className="flex h-auto flex-col items-center gap-1 bg-slate-700 py-3 text-xs text-white hover:bg-slate-600"
                disabled={isPartidaFinalizada}
              >
                {evento}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="mt-8 flex gap-4 pb-8">
          <Button
            className="flex-1 bg-slate-700 py-6 text-white hover:bg-slate-600"
            disabled={isPartidaFinalizada}
          >
            Pausar Partida
          </Button>
          <Button
            className="flex-1 bg-green-600 py-6 text-white hover:bg-green-700"
            onClick={handleFinalizarPartida}
            disabled={isPartidaFinalizada || isUpdatingPartida}
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
        <div className="flex min-h-screen items-center justify-center">
          Carregando...
        </div>
      }
    >
      <ScoutContent />
    </Suspense>
  );
}

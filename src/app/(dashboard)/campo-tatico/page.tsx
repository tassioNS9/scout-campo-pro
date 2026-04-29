"use client";
import { Plus } from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Jogador {
  numero: number;
  nome: string;
  posicao: string;
  x: number;
  y: number;
}

interface FormacaoConfig {
  [key: string]: Jogador[];
}

const FORMACOES_INICIAIS: FormacaoConfig = {
  "4-3-3": [
    { numero: 1, nome: "Matheus", posicao: "Goleiro", x: 15, y: 50 },
    { numero: 2, nome: "Diego", posicao: "Zagueiro", x: 25, y: 40 },
    { numero: 3, nome: "Bruno", posicao: "Zagueiro", x: 25, y: 60 },
    { numero: 4, nome: "Carlos", posicao: "Lateral", x: 30, y: 80 },
    { numero: 5, nome: "Pedro", posicao: "Lateral", x: 30, y: 20 },
    { numero: 6, nome: "Matheus Araújo", posicao: "Meia", x: 40, y: 40 },
    { numero: 7, nome: "Rafael", posicao: "Meia", x: 40, y: 55 },
    { numero: 8, nome: "Guilherme", posicao: "Atacante", x: 70, y: 75 },
    { numero: 9, nome: "Lukas", posicao: "Atacante", x: 85, y: 50 },
    { numero: 10, nome: "Inácio", posicao: "Meia", x: 65, y: 50 },
    { numero: 11, nome: "Gabriel", posicao: "Atacante", x: 75, y: 30 },
  ],
  "4-4-2": [
    { numero: 1, nome: "Matheus", posicao: "Goleiro", x: 15, y: 50 },
    { numero: 2, nome: "Diego", posicao: "Zagueiro", x: 25, y: 40 },
    { numero: 3, nome: "Bruno", posicao: "Zagueiro", x: 25, y: 60 },
    { numero: 4, nome: "Carlos", posicao: "Lateral", x: 30, y: 80 },
    { numero: 5, nome: "Pedro", posicao: "Lateral", x: 30, y: 20 },
    { numero: 6, nome: "Matheus Araújo", posicao: "Meia", x: 45, y: 30 },
    { numero: 7, nome: "Lukas", posicao: "Meia", x: 45, y: 60 },
    { numero: 8, nome: "Guilherme", posicao: "Lateral", x: 45, y: 80 },
    { numero: 9, nome: "Rafael", posicao: "Atacante", x: 75, y: 35 },
    { numero: 10, nome: "Inácio", posicao: "Meia", x: 45, y: 45 },
    { numero: 11, nome: "Carlos", posicao: "Atacante", x: 75, y: 65 },
  ],
  "3-5-2": [
    { numero: 1, nome: "Matheus", posicao: "Goleiro", x: 15, y: 50 },
    { numero: 2, nome: "Diego", posicao: "Zagueiro", x: 25, y: 35 },
    { numero: 3, nome: "Bruno", posicao: "Zagueiro", x: 25, y: 50 },
    { numero: 4, nome: "Gabriel", posicao: "Zagueiro", x: 25, y: 65 },
    { numero: 5, nome: "Matheus", posicao: "Meia", x: 45, y: 15 },
    { numero: 7, nome: "Lukas", posicao: "Meia", x: 45, y: 30 },
    { numero: 6, nome: "Matheus Araújo", posicao: "Meia", x: 45, y: 45 },
    { numero: 8, nome: "Guilherme", posicao: "Meia", x: 45, y: 60 },
    { numero: 10, nome: "Inácio", posicao: "Meia", x: 45, y: 75 },
    { numero: 9, nome: "Rafael", posicao: "Atacante", x: 75, y: 35 },
    { numero: 11, nome: "Carlos", posicao: "Atacante", x: 75, y: 65 },
  ],
  "5-3-2": [
    { numero: 1, nome: "Matheus", posicao: "Goleiro", x: 15, y: 50 },
    { numero: 2, nome: "Diego", posicao: "Zagueiro", x: 25, y: 50 },
    { numero: 3, nome: "Bruno", posicao: "Zagueiro", x: 25, y: 65 },
    { numero: 4, nome: "Carlos", posicao: "Lateral", x: 30, y: 80 },
    { numero: 5, nome: "Pedro", posicao: "Lateral", x: 30, y: 20 },
    { numero: 6, nome: "Matheus Araújo", posicao: "Zagueiro", x: 25, y: 35 },
    { numero: 10, nome: "Inácio", posicao: "Meia", x: 50, y: 50 },
    { numero: 7, nome: "Lukas", posicao: "Meia", x: 50, y: 30 },
    { numero: 8, nome: "Guilherme", posicao: "Meia", x: 50, y: 70 },
    { numero: 9, nome: "Rafael", posicao: "Atacante", x: 75, y: 35 },
    { numero: 11, nome: "Carlos", posicao: "Atacante", x: 75, y: 65 },
  ],
};

const CAMPO_LIMITE = {
  minX: 4,
  maxX: 96,
  minY: 4,
  maxY: 96,
};

const clamped = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const criarFormacoesIniciais = (): FormacaoConfig =>
  Object.fromEntries(
    Object.entries(FORMACOES_INICIAIS).map(([chave, jogadores]) => [
      chave,
      jogadores.map((jogador) => ({ ...jogador })),
    ]),
  );

export default function CampoTatico() {
  const [formacao, setFormacao] = useState("4-3-3");
  const [jogadoresPorFormacao, setJogadoresPorFormacao] =
    useState<FormacaoConfig>(criarFormacoesIniciais);
  const [jogadorArrastando, setJogadorArrastando] = useState<number | null>(
    null,
  );
  const campoRef = useRef<SVGSVGElement>(null);
  const [eventos, setEventos] = useState({
    gols: 0,
    assistencias: 0,
    finalizacoes: 0,
    desarmes: 0,
  });

  const getFormacaoStats = () => {
    const stats = { goleiros: 0, defesa: 0, meio: 0, ataque: 0 };
    formacao === "3-5-2"
      ? ((stats.defesa = 3), (stats.meio = 5), (stats.ataque = 2))
      : formacao === "4-4-2"
        ? ((stats.defesa = 4), (stats.meio = 4), (stats.ataque = 2))
        : ((stats.defesa = 4), (stats.meio = 3), (stats.ataque = 3));
    stats.goleiros = 1;
    return stats;
  };

  const stats = getFormacaoStats();

  const jogadores =
    jogadoresPorFormacao[formacao] ?? jogadoresPorFormacao["4-3-3"];

  const getPosicaoPonteiro = (event: ReactPointerEvent<SVGSVGElement>) => {
    const campo = campoRef.current;
    if (!campo) {
      return null;
    }

    const rect = campo.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    return {
      x: clamped(x, CAMPO_LIMITE.minX, CAMPO_LIMITE.maxX),
      y: clamped(y, CAMPO_LIMITE.minY, CAMPO_LIMITE.maxY),
    };
  };

  const moverJogador = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (jogadorArrastando === null) {
      return;
    }

    const posicao = getPosicaoPonteiro(event);
    if (!posicao) {
      return;
    }

    setJogadoresPorFormacao((prev) => ({
      ...prev,
      [formacao]: (prev[formacao] ?? []).map((jogador) =>
        jogador.numero === jogadorArrastando
          ? { ...jogador, x: posicao.x, y: posicao.y }
          : jogador,
      ),
    }));
  };

  const iniciarArraste = (
    numeroJogador: number,
    event: ReactPointerEvent<SVGGElement>,
  ) => {
    event.preventDefault();
    setJogadorArrastando(numeroJogador);
  };

  const finalizarArraste = () => {
    setJogadorArrastando(null);
  };

  // Handlers para eventos
  const handleEvento = (tipo: keyof typeof eventos) => {
    setEventos((prev) => ({
      ...prev,
      [tipo]: prev[tipo] + 1,
    }));

    const mensagens = {
      gols: "⚽ Gol marcado!",
      assistencias: "👟 Assistência registrada!",
      finalizacoes: "🎯 Finalização registrada!",
      desarmes: "🛡️ Desarme registrado!",
    };

    toast.success(mensagens[tipo]);
  };

  const resetarEventos = () => {
    setEventos({
      gols: 0,
      assistencias: 0,
      finalizacoes: 0,
      desarmes: 0,
    });
    toast.info("Eventos resetados!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      {/* <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Campo Tático</h1>
          </div>
          <button className="text-slate-400 hover:text-white transition">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Left Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Formação */}
            <Card className="border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Formação</h3>
              <select
                value={formacao}
                onChange={(e) => {
                  setFormacao(e.target.value);
                  toast.success(`Formação alterada para ${e.target.value}!`);
                }}
                className="mb-4 w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white transition hover:border-green-500"
              >
                <option value="4-3-3">4-3-3</option>
                <option value="4-4-2">4-4-2</option>
                <option value="3-5-2">3-5-2</option>
                <option value="5-3-2">5-3-2</option>
              </select>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500">
                  {formacao}
                </div>
              </div>
            </Card>

            {/* Eventos */}
            <Card className="border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Eventos</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => handleEvento("gols")}
                  className="w-full bg-green-600 py-2 font-bold text-white transition hover:bg-green-700"
                >
                  ⚽ Gol ({eventos.gols})
                </Button>
                <Button
                  onClick={() => handleEvento("assistencias")}
                  className="w-full bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700"
                >
                  👟 Assistência ({eventos.assistencias})
                </Button>
                <Button
                  onClick={() => handleEvento("finalizacoes")}
                  className="w-full bg-orange-600 py-2 font-bold text-white transition hover:bg-orange-700"
                >
                  🎯 Finalização ({eventos.finalizacoes})
                </Button>
                <Button
                  onClick={() => handleEvento("desarmes")}
                  className="w-full bg-purple-600 py-2 font-bold text-white transition hover:bg-purple-700"
                >
                  🛡️ Desarme ({eventos.desarmes})
                </Button>
                <Button
                  onClick={resetarEventos}
                  variant="outline"
                  className="w-full border-slate-600 py-2 text-slate-300 transition hover:bg-slate-700"
                >
                  🔄 Resetar
                </Button>
              </div>
            </Card>

            {/* Jogadores List */}
            <Card className="border-slate-700 bg-slate-800 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Escalação</h3>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {jogadores.map((j) => (
                  <div
                    key={j.numero}
                    className="rounded-lg bg-slate-700 p-3 transition hover:bg-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                        {j.numero}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {j.nome}
                        </p>
                        <p className="text-xs text-slate-400">{j.posicao}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Add Player */}
            <Button className="flex w-full items-center gap-2 bg-green-600 py-2 text-white transition hover:bg-green-700">
              <Plus className="h-4 w-4" />
              Adicionar Jogador
            </Button>
          </div>

          {/* Campo Tático */}
          <div className="lg:col-span-3">
            <Card className="border-green-700 bg-gradient-to-b from-green-900 to-green-800 p-8">
              {/* Campo SVG */}
              <svg
                ref={campoRef}
                viewBox="0 0 100 100"
                onPointerMove={moverJogador}
                onPointerUp={finalizarArraste}
                onPointerLeave={finalizarArraste}
                onPointerCancel={finalizarArraste}
                className="w-full touch-none rounded-lg border-4 border-white bg-gradient-to-b from-green-700 to-green-800 select-none"
              >
                <g fill="none" stroke="white" strokeWidth="0.5">
                  {/* Limites e meio campo */}
                  <rect x="2" y="2" width="96" height="96" />
                  <line x1="50" y1="2" x2="50" y2="98" />
                  <circle cx="50" cy="50" r="10" />

                  {/* Grandes áreas */}
                  <rect x="2" y="21" width="16" height="58" />
                  <rect x="82" y="21" width="16" height="58" />

                  {/* Pequenas áreas */}
                  <rect x="2" y="36" width="6" height="28" />
                  <rect x="92" y="36" width="6" height="28" />

                  {/* Meia-lua das áreas */}
                  <path d="M 18 44 A 8 8 0 0 1 18 56" />
                  <path d="M 82 44 A 8 8 0 0 0 82 56" />
                </g>

                {/* Marcas centrais e pênaltis */}
                <circle cx="50" cy="50" r="1" fill="white" />
                <circle cx="14" cy="50" r="0.8" fill="white" />
                <circle cx="86" cy="50" r="0.8" fill="white" />

                {/* Jogadores */}
                {jogadores.map((j) => (
                  <g
                    key={j.numero}
                    onPointerDown={(event) => iniciarArraste(j.numero, event)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <circle
                      cx={j.x}
                      cy={j.y}
                      r="2.5"
                      fill="hsl(var(--primary))"
                      stroke="white"
                      strokeWidth="0.3"
                      className="transition"
                    />
                    <text
                      x={j.x}
                      y={j.y}
                      textAnchor="middle"
                      dy="0.3em"
                      fill="white"
                      fontSize="1.2"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {j.numero}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legend */}
              {/* Formation Info */}
              <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                <h3 className="mb-4 text-lg font-bold">Formação: {formacao}</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="mb-2 text-sm text-slate-400">Goleiro</p>
                    <p className="text-2xl font-black text-blue-400">
                      {stats.goleiros}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 text-sm text-slate-400">Defesa</p>
                    <p className="text-2xl font-black text-blue-400">
                      {stats.defesa}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 text-sm text-slate-400">Meio</p>
                    <p className="text-2xl font-black text-blue-400">
                      {stats.meio}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="mb-2 text-sm text-slate-400">Ataque</p>
                    <p className="text-2xl font-black text-blue-400">
                      {stats.ataque}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

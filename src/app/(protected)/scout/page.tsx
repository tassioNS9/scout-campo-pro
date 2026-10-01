"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { createEvento } from "@/app/actions/create-evento";
import { getPartidaById } from "@/app/actions/get-partida-by-id";
import { listJogadoresByTime } from "@/app/actions/list-jogadores-by-time";
import { listPartidas } from "@/app/actions/list-partidas";
import { updatePartida } from "@/app/actions/update-partida";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Partida } from "@/db/queries";
import type { InsertEvento, Jogador } from "@/db/schema";

type TipoEvento = InsertEvento["tipoEvento"];

// listPartidas() não devolve a linha inteira de `partidas` — é um select
// com join que também traz `nomeTime` (do time do usuário). Derivar o tipo
// a partir do retorno real da action, em vez de reusar `Partida[]`, evita
// que o tipo do estado divirja do que a query de fato retorna: se o select
// em getPartidas() mudar de colunas, este tipo acompanha automaticamente.
type PartidaResumo = Awaited<ReturnType<typeof listPartidas>>[number];

// Os "value" aqui precisam bater EXATAMENTE com os valores do tipoEventoEnum
// em db/schema.ts. Tipar como Record<TipoEvento, string> faz o TypeScript
// acusar erro de compilação se algum valor do enum não estiver mapeado aqui,
// ou se algum "value" não existir no enum — evita a divergência que causava
// erro de constraint no Postgres.
const EVENTO_LABELS = {
  Assistencia: "Assistência",
  Desarme: "Desarme",
  FaltaCometida: "Falta Cometida",
  FaltaSofrida: "Falta Sofrida",
  Gol: "Gol",
  GolContra: "Gol Contra",
  cartaoAmarelo: "Cartão Amarelo",
  cartaoVermelho: "Cartão Vermelho",
  CometerPenalti: "Cometer Pênalti",
  SofrerPenalti: "Sofrer Pênalti",
} satisfies Record<TipoEvento, string>;
// "satisfies" (em vez de tipar a constante como Record<TipoEvento, string>)
// preserva as chaves literais do objeto ao mesmo tempo que valida, em tempo
// de compilação, que todo TipoEvento tem uma entrada e que nenhuma chave
// extra/inválida foi digitada. Se o enum mudar em schema.ts, o TS aponta
// imediatamente qualquer divergência aqui.

const EVENTOS_CONFIG = Object.entries(EVENTO_LABELS) as Array<
  [TipoEvento, string]
>;

// Os componentes <Select> só trabalham com string, então o id da partida
// circula como string no estado. parsePositiveId centraliza a conversão
// seguinda para number, retornando null quando o valor não é um id válido,
// em vez de deixar Number("") ou Number("abc") virarem NaN silenciosamente
// espalhados pelo componente.
function parsePositiveId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function calcularResultado(
  placarTime: number,
  placarAdversario: number,
): Partida["resultado"] {
  if (placarTime > placarAdversario) return "Vitoria";
  if (placarTime < placarAdversario) return "Derrota";
  return "Empate";
}

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
  const [partidaFinalizadaManual, setPartidaFinalizadaManual] = useState(false);
  const [partidas, setPartidas] = useState<PartidaResumo[]>([]);
  const [partida, setPartida] = useState<Partida | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [isUpdatingPartida, setIsUpdatingPartida] = useState(false);
  const [eventoPendente, setEventoPendente] = useState(false);

  const isPartidaFinalizada =
    partidaFinalizadaManual || partida?.status === "finalizada";
  const acoesBloqueadas =
    isPartidaFinalizada || isUpdatingPartida || eventoPendente;

  useEffect(() => {
    let isMounted = true;
    listPartidas()
      .then((partidasData) => {
        if (isMounted) setPartidas(partidasData);
      })
      .catch(() => {
        if (isMounted) toast.error("Erro ao carregar a lista de partidas");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Reseta o estado local do scout (cronômetro, período, placar, flag de
  // finalizada) sempre que o usuário troca de partida, para não arrastar
  // dados da partida anterior.
  useEffect(() => {
    setTempo(0);
    setIsRunning(false);
    setTempoAtual("1T");
    setPartidaFinalizadaManual(false);
    setIdJogador("");
  }, [idPartida]);

  useEffect(() => {
    let isMounted = true;
    const numericId = parsePositiveId(idPartida);
    if (numericId === null) {
      setPartida(null);
      return;
    }
    getPartidaById(numericId)
      .then((data) => {
        // getPartidaByIdQuery pode retornar `undefined` quando não encontra
        // (comum em queries Drizzle com .limit(1)); normalizamos para
        // `null` aqui porque o estado local é tipado como `Partida | null`.
        if (isMounted) setPartida(data ?? null);
      })
      .catch(() => {
        if (isMounted) toast.error("Erro ao carregar dados da partida");
      });
    return () => {
      isMounted = false;
    };
  }, [idPartida]);

  useEffect(() => {
    let isMounted = true;
    const timeId = partida ? partida.idTime : null;
    if (timeId === null) {
      setJogadores([]);
      return;
    }
    listJogadoresByTime(timeId)
      .then((data) => {
        if (isMounted) setJogadores(data);
      })
      .catch(() => {
        if (isMounted) toast.error("Erro ao carregar jogadores do time");
      });
    return () => {
      isMounted = false;
    };
  }, [partida?.id, partida?.idTime]);

  // Sincroniza o placar exibido com o que está salvo na partida
  useEffect(() => {
    setPlacarA(partida?.placarTime ?? 0);
    setPlacarB(partida?.placarTimeAdversario ?? 0);
  }, [partida]);

  // Timer
  useEffect(() => {
    if (!isRunning) return;

    // ReturnType<typeof setInterval>, em vez de NodeJS.Timeout, é o tipo
    // correto tanto em ambiente Node quanto no bundle do browser (evita
    // depender dos @types/node para um valor que, no client, é number).
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Atualiza o placar da partida no banco a partir de um evento de gol.
  // "Gol" soma pro time do próprio jogador; "Gol Contra" soma pro adversário.
  // Não cria nenhum evento novo aqui — só ajusta o placarTime/placarTimeAdversario.
  const atualizarPlacarPorGol = async (tipoEvento: "Gol" | "GolContra") => {
    if (!partida) return;

    const jogadorId = parsePositiveId(idJogador);
    const jogador = jogadores.find((j) => j.id === jogadorId);
    if (!jogador) return;

    const marcaParaTimeA =
      tipoEvento === "Gol"
        ? jogador.idTime === partida.idTime
        : jogador.idTime !== partida.idTime;

    const novoPlacarA = marcaParaTimeA ? placarA + 1 : placarA;
    const novoPlacarB = marcaParaTimeA ? placarB : placarB + 1;

    // Atualização otimista: a tela já reflete o novo placar antes da
    // resposta do servidor, e se der erro, revertemos.
    setPlacarA(novoPlacarA);
    setPlacarB(novoPlacarB);

    try {
      await updatePartida({
        id: partida.id,
        placarTime: novoPlacarA,
        placarTimeAdversario: novoPlacarB,
      });
    } catch (err) {
      console.error(err);
      setPlacarA(placarA);
      setPlacarB(placarB);
      toast.error("Evento salvo, mas houve erro ao atualizar o placar");
    }
  };

  const registrarEvento = async (tipoEvento: TipoEvento) => {
    if (isPartidaFinalizada) {
      toast.error("A partida já foi finalizada");
      return;
    }
    const partidaId = parsePositiveId(idPartida);
    const jogadorId = parsePositiveId(idJogador);
    if (partidaId === null || jogadorId === null) {
      toast.error("Selecione a partida e o jogador");
      return;
    }
    if (eventoPendente) return; // evita duplo clique gerando evento duplicado

    setEventoPendente(true);
    try {
      await createEvento({
        idPartida: partidaId,
        idJogador: jogadorId,
        tipoEvento,
        minuto: Math.floor(tempo / 60),
        tempo: tempoAtual,
      });
      toast.success(`${EVENTO_LABELS[tipoEvento]} registrado`);

      if (tipoEvento === "Gol" || tipoEvento === "GolContra") {
        await atualizarPlacarPorGol(tipoEvento);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar evento");
    } finally {
      setEventoPendente(false);
    }
  };

  const handleToggleTimer = async () => {
    const novoEstado = !isRunning;
    setIsRunning(novoEstado);

    // Ao dar o primeiro "play", marca a partida como em andamento
    if (novoEstado && partida && partida.status === "planejada") {
      try {
        await updatePartida({ id: partida.id, status: "em_andamento" });
        setPartida((prev) =>
          prev ? { ...prev, status: "em_andamento" } : prev,
        );
      } catch (err) {
        console.error(err);
        toast.error("Erro ao atualizar status da partida");
      }
    }
  };

  const handleFinalizarPartida = async () => {
    if (isPartidaFinalizada) {
      toast.error("A partida já foi finalizada");
      return;
    }
    if (!partida) {
      toast.error("Selecione a partida");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja finalizar a partida? Essa ação não pode ser desfeita.",
    );
    if (!confirmar) return;

    try {
      setIsUpdatingPartida(true);
      await updatePartida({
        id: partida.id,
        placarTime: placarA,
        placarTimeAdversario: placarB,
        status: "finalizada",
        resultado: calcularResultado(placarA, placarB),
      });
      setIsRunning(false);
      setPartidaFinalizadaManual(true);
      toast.success("Partida finalizada com sucesso");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao finalizar partida");
    } finally {
      setIsUpdatingPartida(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="container mx-auto px-4 py-8">
        {/* Selection Row */}
        <div className="mb-8 flex flex-col gap-2 px-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Partida
            </label>
            <Select
              value={idPartida}
              onValueChange={setIdPartida}
              disabled={eventoPendente || isUpdatingPartida}
            >
              <SelectTrigger className="border-slate-700 bg-slate-800 text-white">
                <SelectValue placeholder="Selec uma partida" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-800">
                {partidas.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nomeTime.split(" ")[0]} vs {p.nomeTimeAdversario} —
                    {new Date(p.data).toLocaleDateString("pt-BR")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Jogador
            </label>
            <Select
              value={idJogador}
              onValueChange={setIdJogador}
              disabled={eventoPendente || isUpdatingPartida || !idPartida}
            >
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
        <div className="mb-8 rounded-lg border border-slate-600 bg-linear-to-r from-slate-800 to-slate-700 p-8">
          <div className="grid grid-cols-3 items-center gap-8">
            {/* Time A */}
            <div className="text-center">
              <div className="mb-2 text-sm text-slate-400">Time A</div>
              <div className="flex items-center justify-center gap-2">
                <span className="min-w-25 text-center text-6xl font-bold text-blue-400">
                  {placarA}
                </span>
              </div>
            </div>

            {/* Timer and Period */}
            <div className="text-center">
              <div className="mb-4 font-mono text-3xl font-bold text-green-500">
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
                  onClick={handleToggleTimer}
                  className={`${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                  disabled={isPartidaFinalizada}
                  aria-label={
                    isRunning ? "Pausar cronômetro" : "Iniciar cronômetro"
                  }
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
                  aria-label="Zerar cronômetro"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Time B */}
            <div className="text-center">
              <div className="mb-2 text-sm text-slate-400">
                {partida?.nomeTimeAdversario ?? "Time B"}
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="min-w-25 text-center text-6xl font-bold text-yellow-400">
                  {placarB}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Eventos */}
        <Card className="border-slate-700 bg-slate-800 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Registrar Eventos</h3>
            {eventoPendente && (
              <span className="text-xs text-slate-400">Salvando...</span>
            )}
          </div>
          <div
            className={`grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 ${
              eventoPendente ? "opacity-60" : ""
            }`}
          >
            {EVENTOS_CONFIG.map(([value, label]) => (
              <Button
                key={value}
                onClick={() => registrarEvento(value)}
                className="flex h-auto flex-col items-center gap-1 bg-slate-700 py-3 text-xs text-white hover:bg-slate-600"
                disabled={acoesBloqueadas || !idJogador || !idPartida}
              >
                {label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Bottom Action Buttons */}
        <div className="mt-8 flex gap-4 pb-8">
          <Button
            className="flex-1 bg-slate-700 py-6 text-white hover:bg-slate-600"
            onClick={handleToggleTimer}
            disabled={isPartidaFinalizada}
          >
            {isRunning ? "Pausar Partida" : "Retomar Partida"}
          </Button>
          <Button
            className="flex-1 bg-green-600 py-6 text-white hover:bg-green-700"
            onClick={handleFinalizarPartida}
            disabled={
              isPartidaFinalizada || isUpdatingPartida || eventoPendente
            }
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

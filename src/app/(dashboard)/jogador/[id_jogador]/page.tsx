import { getJogadorById } from "@/app/actions/get-jogador-by-id";
import { getEstatisticasByJogador } from "@/db/queries";

import type { PlayerDashboardPlayer } from "./components/PlayerDashboard";
import { PlayerDashboard } from "./components/PlayerDashboard";
const JogadorDetails = async ({
  params,
}: {
  params: { id_jogador: number };
}) => {
  const { id_jogador } = await params;

  if (!id_jogador) return null;

  const [jogador, times] = await Promise.all([
    getJogadorById(id_jogador),
    getEstatisticasByJogador(id_jogador),
  ]);
  console.log("Jogador encontradorrrr:", times);
  const player: PlayerDashboardPlayer = {
    nome: jogador?.nome,
    posicao: jogador?.posicao,
    idade: jogador?.idade,
    numero: jogador?.numero,
    stats: {
      totalGols: jogador?.totalGols ?? "0",
      totalPartidas: jogador?.totalPartidas,
      totalAssistencias: jogador?.totalAssistencias ?? "0",
      totalDriblesCertos: jogador?.totalDriblesCertos ?? "0",
      totalDriblesErrados: jogador?.totalDriblesErrados ?? "0",
      totalFinalizacoesCertas: jogador?.totalFinalizacoesCertas ?? "0",
      totalFinalizacoesErradas: jogador?.totalFinalizacoesErradas ?? "0",
      totalCruzamentos: jogador?.totalCruzamentos ?? "0",
      totalDesarmes: jogador?.totalDesarmes ?? "0",
      totalInterceptacoes: jogador?.totalInterceptacoes ?? "0",
      totalGanhoBola: jogador?.totalGanhoBola ?? "0",
      totalPerdaBola: jogador?.totalPerdaBola ?? "0",
      totalFaltas: jogador?.totalFaltas ?? "0",
      totalNota: jogador?.totalNota ?? "0",
    },
    matchHistory: [],
  };

  console.log("Jogador encontrado:", jogador);
  return <PlayerDashboard player={player} />;
};

export default JogadorDetails;

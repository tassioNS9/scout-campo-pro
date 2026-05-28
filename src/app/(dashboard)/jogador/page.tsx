import Link from "next/link";
import type { PlayerDashboardPlayer } from "./components/PlayerDashboard";
import { PlayerDashboard } from "./components/PlayerDashboard";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  getEstatisticasByJogador,
  getJogadorById,
  getPartidas,
  getTimesAll,
} from "@/db/queries";

type SearchParams = {
  id?: string;
};

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString("pt-BR");
}

function parseNota(nota: string | number | null | undefined) {
  const parsed = typeof nota === "string" ? Number(nota) : (nota ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default async function Jogador({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const idJogador = resolvedSearchParams.id
    ? Number(resolvedSearchParams.id)
    : NaN;

  if (!Number.isFinite(idJogador) || idJogador <= 0) {
    return (
      <Empty className="min-h-[60vh]">
        <EmptyHeader>
          <EmptyTitle>Nenhum jogador selecionado</EmptyTitle>
          <EmptyDescription>
            Selecione um jogador para visualizar o painel completo.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/jogadores">Ver jogadores</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const jogador = await getJogadorById(idJogador);

  if (!jogador) {
    return (
      <Empty className="min-h-[60vh]">
        <EmptyHeader>
          <EmptyTitle>Jogador não encontrado</EmptyTitle>
          <EmptyDescription>
            Verifique se o jogador existe ou escolha outro registro.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/jogadores">Ver jogadores</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const [estatisticas, partidas, times] = await Promise.all([
    getEstatisticasByJogador(jogador.id),
    getPartidas(),
    getTimesAll(),
  ]);

  const totalPartidas = estatisticas.length;
  const rating = totalPartidas > 0 ? totals.ratingTotal / totalPartidas : 0;

  const player: PlayerDashboardPlayer = {
    fullName: jogador.nome,
    mainPosition: jogador.posicao,
    alternativePositions: [],
    age: jogador.idade ?? undefined,
    rating,
    playerNumber: jogador.numero,
    team: timeJogador,
    stats: {
      goals: totals.goals,
      matches: totalPartidas,
      assists: totals.assists,
      tackles: totals.tackles,
      yellowCards: 0,
      redCards: 0,
      shots: totals.shots,
      corners: totals.corners,
    },
    matchHistory,
  };

  return <PlayerDashboard player={player} />;
}

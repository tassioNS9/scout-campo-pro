import Image from "next/image";

import {
  getHistoricoPartidasPorJogador,
  getHistoricoTotalJogador,
} from "@/db/queries";

import { TabContainer } from "./components/TabContainer";

const JogadorDetails = async ({
  params,
}: {
  params: { id_jogador: number };
}) => {
  const { id_jogador } = await params;

  if (!id_jogador) return null;

  const [historicoJogador, historicoPartidas] = await Promise.all([
    getHistoricoTotalJogador(id_jogador),
    getHistoricoPartidasPorJogador(id_jogador),
  ]);
  console.log("historicoJogador", historicoJogador);

  const hasMatches = historicoJogador.totalPartidas > 0;
  const displayRating = hasMatches ? historicoJogador.nota : "—";

  return (
    <div className="min-h-screen items-center justify-center bg-[linear-gradient(160deg,var(--scout-bg)_0%,var(--scout-bg-alt)_100%)] p-4 md:flex md:p-2">
      <div className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl md:max-w-7xl">
        {/* Header */}
        <div className="relative p-6 pb-4 md:p-8">
          {/* Player Info - Desktop Layout */}
          <div className="md:flex md:items-center md:gap-8">
            <div className="mb-4 flex flex-col items-center md:mb-0">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 bg-transparent md:h-40 md:w-40">
                  {historicoJogador?.perfil?.fotoUrl ? (
                    <Image
                      className="rounded-full"
                      src={historicoJogador.perfil.fotoUrl!}
                      alt="Player Photo"
                      width={130}
                      height={130}
                    />
                  ) : (
                    <Image
                      src={"/player_default.png"}
                      alt="Player Default Photo"
                      width={130}
                      height={130}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* Player Name and Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mt-3 text-2xl font-bold text-white md:mt-0 md:text-4xl">
                {historicoJogador.perfil.nome}
              </h1>
              <div className="mt-2 space-y-1 text-xs text-emerald-400 md:text-base">
                {/* <p>{player.team}</p> */}
                <p className="text-primary font-semibold">
                  {historicoJogador.perfil.posicao}
                </p>
                <p>
                  {historicoJogador.perfil.idade
                    ? `Idade: ${historicoJogador.perfil.idade} anos`
                    : "Idade: —"}{" "}
                  | Número: {historicoJogador.perfil.numero}
                </p>
              </div>

              {/* Desktop Quick Stats */}
              <div className="mt-6 hidden gap-4 md:grid md:grid-cols-2">
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Nota Média</p>
                  <p className="text-primary mt-1 text-3xl font-bold">
                    {displayRating}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Gols</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {historicoJogador.eventos.gols}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Assistências</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {historicoJogador.eventos.assistencias}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-800 p-4">
                  <p className="text-sm text-zinc-400">Jogos</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {historicoJogador.totalPartidas}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <TabContainer
            playerInfo={historicoJogador}
            matchs={historicoPartidas}
          />
        </div>
      </div>
    </div>
  );
};

export default JogadorDetails;

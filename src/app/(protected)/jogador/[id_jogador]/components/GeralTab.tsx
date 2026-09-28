import { Star } from "lucide-react";

import StatisticCard from "./StatisticCard";

interface PlayerInfo {
  perfil: {
    nome: string;
    idade: number;
    numero: number;
    posicao:
      | "Goleiro"
      | "Zagueiro"
      | "Lateral"
      | "Volante"
      | "Meia"
      | "Atacante";
  };
  eventos: {
    gols: number;
    golsContra: number;
    assistencias: number;
    desarmes: number;
    faltasCometidas: number;
    faltasSofridas: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    penaltisCometidos: number;
    penaltisSofridos: number;
  };
  totalPartidas: number;
  nota: number;
}

const GeralTab = ({
  geralHistoric,
  displayRating,
  hasMatches,
}: {
  geralHistoric: PlayerInfo;
  displayRating: string | number;
  hasMatches: boolean;
}) => {
  const renderStars = (rating: number) => {
    const normalizedRating = Math.min(Math.max((rating / 10) * 5, 0), 5);
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = Math.max(5 - fullStars - (hasHalfStar ? 1 : 0), 0);

    return (
      <div className="flex items-center justify-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="fill-primary text-primary h-3 w-3"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="text-primary h-3 w-3" />
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star className="fill-primary text-primary h-3 w-3" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-primary/40 h-3 w-3" />
        ))}
      </div>
    );
  };
  return (
    <>
      {/* Mobile Quick Stats */}
      <div className="mb-4 grid grid-cols-2 gap-4 md:hidden">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-800 p-4">
          <p className="mb-2 text-xs text-zinc-400">Nota Média</p>
          <p className="text-primary text-5xl font-bold">{displayRating}</p>
          {hasMatches && <div className="mt-2">{renderStars(8.3)}</div>}
        </div>

        <div className="space-y-2 rounded-2xl bg-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Gols</span>
            <span className="font-semibold text-white">
              {geralHistoric.eventos.gols}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Assistências</span>
            <span className="font-semibold text-white">
              {geralHistoric.eventos.assistencias}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Total Partidas</span>
            <span className="font-semibold text-white">
              {geralHistoric.totalPartidas}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="mt-4">
        <p className="mb-3 text-xs text-zinc-400 md:mb-4 md:text-sm">
          VARIÁVEIS
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-between rounded-xl bg-zinc-800 p-3 md:flex-row md:p-4">
            <span className="mb-2 text-sm text-zinc-400 md:mb-0 md:text-base">
              Cartões
            </span>
            <div className="flex gap-2">
              <div className="flex items-center gap-1">
                <div className="h-4 w-3 rounded-sm bg-yellow-400 md:h-5 md:w-4"></div>
                <span className="text-sm font-semibold text-white md:text-base">
                  {geralHistoric.eventos.cartoesAmarelos}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-destructive h-4 w-3 rounded-sm md:h-5 md:w-4"></div>
                <span className="text-sm font-semibold text-white md:text-base">
                  {geralHistoric.eventos.cartoesVermelhos}
                </span>
              </div>
            </div>
          </div>

          <StatisticCard
            label="Faltas Cometidas"
            value={geralHistoric.eventos.faltasCometidas}
          />
          <StatisticCard
            label="Faltas Sofridas"
            value={geralHistoric.eventos.faltasSofridas}
          />
        </div>
      </div>
    </>
  );
};

export default GeralTab;

import { Star } from "lucide-react";

import { PartidaComEventosJogador } from "@/types/jogador";

import { MatchStatRow } from "./MatchStatRow";

interface matchHistoricProps {
  matchs: PartidaComEventosJogador[];
}

const HistoricTab = ({ matchs }: matchHistoricProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      <p className="mb-3 text-xs text-zinc-500 md:mb-4 md:text-sm">
        HISTÓRICO DE PARTIDAS
      </p>
      {matchs.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhuma partida registrada para este jogador.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
          {matchs.map((match) => (
            <div
              key={match.idPartida}
              className="space-y-3 rounded-xl bg-zinc-800 p-4 md:p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white md:text-lg">
                    {match.adversario}
                  </h3>
                  <p className="text-xs text-zinc-400 md:text-sm">
                    {new Date(match.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-white md:text-lg">
                    {match.placarTime} x {match.placarAdversario}{" "}
                    {match.resultado === "Vitoria" ? (
                      <span className="text-green-500">V</span>
                    ) : match.resultado === "Derrota" ? (
                      <span className="text-red-500">D</span>
                    ) : (
                      <span className="text-yellow-500">Empate</span>
                    )}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    <span className="text-primary text-sm font-bold md:text-base">
                      {8}
                    </span>
                    <Star className="fill-primary text-primary h-3 w-3 md:h-4 md:w-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                {[
                  {
                    label: "Gols",
                    value: match.gols,
                  },
                  {
                    label: "Assistências",
                    value: match.assistencias,
                  },
                  {
                    label: "Faltas Cometidas",
                    value: match.faltasCometidas,
                  },
                  {
                    label: "Faltas Sofridas",
                    value: match.faltasSofridas,
                  },
                  {
                    label: "Desarmes",
                    value: match.desarmes,
                  },
                ].map((item) => (
                  <MatchStatRow
                    key={`${match.idPartida}-${item.label}`}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricTab;

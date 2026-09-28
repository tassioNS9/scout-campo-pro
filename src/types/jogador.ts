// Tipo dos contadores de evento (reutilizado nos dois retornos)

import { pgEnum } from "drizzle-orm/pg-core";

export const resultadoEnum = pgEnum("resultado", [
  "Vitoria",
  "Derrota",
  "Empate",
  "Sem_Resultado",
]);

export const casaOuForaEnum = pgEnum("casa_ou_fora", ["casa", "fora"]);

export type ContadoresEvento = {
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
  mediaNota?: number;
};

export type TotaisJogador = ContadoresEvento & {
  totalPartidas: number;
};

export type PartidaComEventosJogador = ContadoresEvento & {
  idPartida: number;
  adversario: string;
  placarTime: number;
  placarAdversario: number;
  data: Date;
  resultado: (typeof resultadoEnum.enumValues)[number] | null;
  casaOuFora: (typeof casaOuForaEnum.enumValues)[number];
};

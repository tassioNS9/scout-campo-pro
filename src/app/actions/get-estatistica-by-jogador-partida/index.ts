"use server";

import { getEstatisticasByJogadorPartida } from "@/db/queries";

export const getEstatisticaByJogadorPartida = async (
  idJogador: number,
  idPartida: number,
) => {
  return await getEstatisticasByJogadorPartida(idJogador, idPartida);
};

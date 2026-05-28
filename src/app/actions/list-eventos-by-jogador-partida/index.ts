"use server";

import { getEventosByJogadorPartida } from "@/db/queries";

export const listEventosByJogadorPartida = async (
  idJogador: number,
  idPartida: number,
) => {
  return await getEventosByJogadorPartida(idJogador, idPartida);
};

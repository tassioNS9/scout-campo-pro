"use server";

import { getEstatisticasByPartida } from "@/db/queries";

export const listEstatisticasByPartida = async (idPartida: number) => {
  return await getEstatisticasByPartida(idPartida);
};

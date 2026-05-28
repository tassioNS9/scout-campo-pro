"use server";

import { getRelatorioByPartida as getRelatorioByPartidaQuery } from "@/db/queries";

export const getRelatorioByPartida = async (idPartida: number) => {
  return await getRelatorioByPartidaQuery(idPartida);
};

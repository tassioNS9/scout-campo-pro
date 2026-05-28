"use server";

import { getDashboardByPartida as getDashboardByPartidaQuery } from "@/db/queries";

export const getDashboardByPartida = async (idPartida: number) => {
  return await getDashboardByPartidaQuery(idPartida);
};

"use server";

import { getJogadoresByTime } from "@/db/queries";

export const listJogadoresByTime = async (idTime: number) => {
  return await getJogadoresByTime(idTime);
};

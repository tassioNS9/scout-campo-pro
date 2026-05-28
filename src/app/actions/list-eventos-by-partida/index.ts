"use server";

import { getEventosByPartida } from "@/db/queries";

export const listEventosByPartida = async (idPartida: number) => {
  return await getEventosByPartida(idPartida);
};

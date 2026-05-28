"use server";

import { getJogadorById as getJogadorByIdQuery } from "@/db/queries";

export const getJogadorById = async (id: number) => {
  return await getJogadorByIdQuery(id);
};

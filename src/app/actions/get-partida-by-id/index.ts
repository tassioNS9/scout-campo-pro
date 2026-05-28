"use server";

import { getPartidaById as getPartidaByIdQuery } from "@/db/queries";

export const getPartidaById = async (id: number) => {
  return await getPartidaByIdQuery(id);
};

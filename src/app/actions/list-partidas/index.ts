"use server";

import { getPartidas } from "@/db/queries";

export const listPartidas = async () => {
  return await getPartidas();
};

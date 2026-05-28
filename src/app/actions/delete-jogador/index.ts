"use server";

import { headers } from "next/headers";

import { deleteJogador as deleteJogadorQuery } from "@/db/queries";
import { auth } from "@/lib/auth";

export const deleteJogador = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await deleteJogadorQuery(id);
};

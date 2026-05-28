"use server";

import { headers } from "next/headers";

import { updateJogador as updateJogadorQuery } from "@/db/queries";
import type { InsertJogador } from "@/db/schema";
import { auth } from "@/lib/auth";

type UpdateJogadorInput = {
  id: number;
  nome?: InsertJogador["nome"];
  numero?: InsertJogador["numero"];
  posicao?: InsertJogador["posicao"];
  idade?: InsertJogador["idade"];
};

export const updateJogador = async (data: UpdateJogadorInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { id, ...payload } = data;
  return await updateJogadorQuery(id, payload);
};

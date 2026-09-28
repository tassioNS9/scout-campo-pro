"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { type InsertJogador, jogadoresTable } from "@/db/schema";
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

  await db
    .update(jogadoresTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(jogadoresTable.id, data?.id))
    .returning();
};

"use server";

import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { partidas, times } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getPartidas = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db
    .select({
      id: partidas.id,
      data: partidas.data,
      idTime: partidas.idTime,
      nomeTime: times.nome,
      nomeTimeAdversario: partidas.nomeTimeAdversario,
      placarTime: partidas.placarTime,
      placarTimeAdversario: partidas.placarTimeAdversario,
      status: partidas.status,
      resultado: partidas.resultado,
      campeonato: partidas.campeonato,
      categoria: partidas.categoria,
    })
    .from(partidas)
    .innerJoin(times, eq(partidas.idTime, times.id))
    .where(eq(times.userId, session.user.id))
    .orderBy(desc(partidas.data));
};

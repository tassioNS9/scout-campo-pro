"use server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { eventosTable } from "@/db/schema";

export async function getResumoByPartida(partidaId: number) {
  const estatisticasCalculadas = await db
    .select({
      gols: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Gol')::int`,
      desarmes: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Desarme')::int`,
      assistencias: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Assistencia')::int`,
      faltas: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FaltaCometida' or ${eventosTable.tipoEvento} = 'FaltaSofrida')::int`,
      totalEventos: sql<number>`count(*)::int`,
      // ...
    })
    .from(eventosTable)
    .where(eq(eventosTable.idPartida, partidaId));
  return estatisticasCalculadas[0];
}

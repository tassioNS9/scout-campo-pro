"use server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { eventosTable } from "@/db/schema";

export async function getDashboardByPartida(partidaId: number) {
  const estatisticasCalculadas = await db
    .select({
      gols: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Gol')`,
      finalizacoes: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FinalizacaoCerta' or ${eventosTable.tipoEvento} = 'FinalizacaoErrada')`,
      desarmes: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Desarme')`,
      assistencias: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Assistencia')`,
      totalEventos: sql<number>`count(*)`,
      // ...
    })
    .from(eventosTable)
    .where(eq(eventosTable.idPartida, partidaId));
  return estatisticasCalculadas[0];
}

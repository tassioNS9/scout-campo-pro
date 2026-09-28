"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { eventosTable, type InsertEvento } from "@/db/schema";
import { recalcularNotaJogadorNaPartida } from "@/utils/recalcularNota";

// exemplo: ao criar um evento
export async function createEvento(dados: InsertEvento) {
  return await db.transaction(async (tx) => {
    const [evento] = await tx.insert(eventosTable).values(dados).returning();

    await recalcularNotaJogadorNaPartida(dados.idJogador, dados.idPartida);

    return evento;
  });
}

// ao deletar um evento
export async function deleteEvento(idEvento: number) {
  return await db.transaction(async (tx) => {
    const [eventoDeletado] = await tx
      .delete(eventosTable)
      .where(eq(eventosTable.id, idEvento))
      .returning();

    if (eventoDeletado) {
      await recalcularNotaJogadorNaPartida(
        eventoDeletado.idJogador,
        eventoDeletado.idPartida,
      );
    }

    return eventoDeletado;
  });
}

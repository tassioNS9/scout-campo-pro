// lib/notas/recalcularNota.ts
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { estatisticasTable, eventosTable } from "@/db/schema";

import { calcularNotaAPartirDeEventos } from "./calcularNota";

export async function recalcularNotaJogadorNaPartida(
  idJogador: number,
  idPartida: number,
) {
  const eventos = await db
    .select()
    .from(eventosTable)
    .where(
      and(
        eq(eventosTable.idJogador, idJogador),
        eq(eventosTable.idPartida, idPartida),
      ),
    );

  const nota = calcularNotaAPartirDeEventos(eventos);

  // Upsert: cria a estatística se não existir, ou atualiza se já existir
  await db
    .insert(estatisticasTable)
    .values({ idJogador, idPartida, nota })
    .onConflictDoUpdate({
      target: [estatisticasTable.idJogador, estatisticasTable.idPartida],
      set: { nota, updatedAt: new Date() },
    });

  return nota;
}

// actions/get-partida-detalhe.ts
"use server";

import { z } from "zod";

import { db } from "@/db";

const paramsSchema = z.object({
  partidaId: z.coerce.number().int().positive(),
});

export async function getHistoricoEventosByPartida(input: unknown) {
  const { partidaId } = paramsSchema.parse(input);

  const partida = await db.query.partidasTable.findFirst({
    where: (p, { eq }) => eq(p.id, partidaId),
    columns: {
      id: true,
    },
    with: {
      estatisticas: true,
      eventos: {
        orderBy: (e, { asc }) => [asc(e.minuto)],
      },
    },
  });

  if (!partida) throw new Error("Partida não encontrada");

  return partida;
}

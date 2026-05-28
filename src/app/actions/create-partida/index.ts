"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createPartida as createPartidaQuery } from "@/db/queries";
import type { InsertPartida } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createPartida = async (data: InsertPartida) => {
  const categoriaSchema = z.enum([
    "Sub-13",
    "Sub-15",
    "Sub-17",
    "Profissional",
  ]);
  const payload = z
    .object({
      time: z.string().trim(),
      timeAdversario: z.string().trim(),
      data: z.coerce.date(),
      campeonato: z.string().optional(),
      categoria: categoriaSchema,
      formacao: z.string().optional(),
    })
    .parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await createPartidaQuery(payload);
};

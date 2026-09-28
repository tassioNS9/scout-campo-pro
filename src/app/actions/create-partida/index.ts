"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { type InsertPartida, partidasTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createPartida = async (data: InsertPartida) => {
  // const categoriaSchema = z.enum([
  //   "Sub-13",
  //   "Sub-15",
  //   "Sub-17",
  //   "Profissional",
  // ]);
  // const createpartidaSchema = z
  //   .object({
  //     timeId: z.number().int(),
  //     timeAdversario: z.string().trim(),
  //     data: z.coerce.date(),
  //     campeonato: z.string().optional(),
  //     categoria: categoriaSchema,
  //     status: z.enum(["planejada", "em_andamento", "finalizada"]),
  //     casaOuFora: z.enum(["casa", "fora"]),
  //     resultado: z
  //       .enum(["Vitória", "Derrota", "Empate", "Sem Resultado"])
  //       .optional(),
  //   })
  //   .parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  await db.insert(partidasTable).values(data).returning();

  revalidatePath("/partidas");
};

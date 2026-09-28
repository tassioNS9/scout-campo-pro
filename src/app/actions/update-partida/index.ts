"use server";

import { headers } from "next/headers";

import { updatePartida as updatePartidaQuery } from "@/db/queries";
import type { InsertPartida } from "@/db/schema";
import { auth } from "@/lib/auth";

// Deriva os campos opcionais diretamente do InsertPartida via Pick, em vez
// de reescrever manualmente "campo?: InsertPartida['campo']" um por um.
// Assim, se um campo mudar de tipo (ou for renomeado) no schema, o erro
// aparece aqui automaticamente — e para expor um novo campo editável (ex.:
// "campeonato") basta adicioná-lo à lista de Pick abaixo.
type UpdatePartidaInput = {
  id: number;
} & Partial<
  Pick<
    InsertPartida,
    "placarTime" | "placarTimeAdversario" | "status" | "resultado"
  >
>;

export const updatePartida = async (data: UpdatePartidaInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { id, ...payload } = data;
  return await updatePartidaQuery(id, payload);
};

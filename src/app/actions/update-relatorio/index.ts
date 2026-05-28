"use server";

import { headers } from "next/headers";

import { updateRelatorio as updateRelatorioQuery } from "@/db/queries";
import type { InsertRelatorio } from "@/db/schema";
import { auth } from "@/lib/auth";

type UpdateRelatorioInput = {
  id: number;
  melhorJogador?: InsertRelatorio["melhorJogador"];
  analiseAoVivo?: InsertRelatorio["analiseAoVivo"];
  sugestoesAoVivo?: InsertRelatorio["sugestoesAoVivo"];
  pdfUrl?: InsertRelatorio["pdfUrl"];
};

export const updateRelatorio = async (data: UpdateRelatorioInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { id, ...payload } = data;
  return await updateRelatorioQuery(id, payload);
};

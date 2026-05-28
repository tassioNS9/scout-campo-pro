"use server";

import { headers } from "next/headers";

import { updateEstatistica as updateEstatisticaQuery } from "@/db/queries";
import type { InsertEstatistica } from "@/db/schema";
import { auth } from "@/lib/auth";

type UpdateEstatisticaInput = {
  id: number;
  finalizacaoCerta?: InsertEstatistica["finalizacaoCerta"];
  finalizacaoErrada?: InsertEstatistica["finalizacaoErrada"];
  assistencias?: InsertEstatistica["assistencias"];
  dribleCerto?: InsertEstatistica["dribleCerto"];
  dribleErrado?: InsertEstatistica["dribleErrado"];
  cruzamentos?: InsertEstatistica["cruzamentos"];
  desarmes?: InsertEstatistica["desarmes"];
  interceptacoes?: InsertEstatistica["interceptacoes"];
  ganhoBola?: InsertEstatistica["ganhoBola"];
  perdaBola?: InsertEstatistica["perdaBola"];
  faltas?: InsertEstatistica["faltas"];
  gols?: InsertEstatistica["gols"];
  nota?: InsertEstatistica["nota"];
};

export const updateEstatistica = async (data: UpdateEstatisticaInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { id, ...payload } = data;
  return await updateEstatisticaQuery(id, payload);
};

"use server";

import { headers } from "next/headers";

import { updatePartida as updatePartidaQuery } from "@/db/queries";
import type { InsertPartida } from "@/db/schema";
import { auth } from "@/lib/auth";

type UpdatePartidaInput = {
  id: number;
  placarTimeA?: InsertPartida["placarTimeA"];
  placarTimeB?: InsertPartida["placarTimeB"];
  status?: InsertPartida["status"];
  formacao?: InsertPartida["formacao"];
};

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

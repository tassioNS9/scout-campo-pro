"use server";

import { headers } from "next/headers";

import { updateTime as updateTimeQuery } from "@/db/queries";
import type { InsertTime } from "@/db/schema";
import { auth } from "@/lib/auth";

type UpdateTimeInput = {
  id: number;
  nome?: InsertTime["nome"];
  categoria?: InsertTime["categoria"];
  cidade?: InsertTime["cidade"];
  estado?: InsertTime["estado"];
};

export const updateTime = async (data: UpdateTimeInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { id, ...payload } = data;
  return await updateTimeQuery(id, payload);
};

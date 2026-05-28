"use server";

import { headers } from "next/headers";

import { createJogador as createJogadorQuery } from "@/db/queries";
import type { InsertJogador } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createJogador = async (data: InsertJogador) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await createJogadorQuery(data);
};

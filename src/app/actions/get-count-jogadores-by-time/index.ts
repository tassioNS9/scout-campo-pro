"use server";

import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { jogadoresTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getCountJogadoresByTime = async (idTime: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select({ count: count() })
    .from(jogadoresTable)
    .where(eq(jogadoresTable.idTime, idTime));
  return result;
};

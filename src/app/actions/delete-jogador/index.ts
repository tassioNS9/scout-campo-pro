"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { jogadoresTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const deleteJogador = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  await db.delete(jogadoresTable).where(eq(jogadoresTable.id, id));
  refresh();
};

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { type InsertTime, timesTable } from "@/db/schema";
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
  await db
    .update(timesTable)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(timesTable.id, id))
    .returning();

  revalidatePath("/times");
};

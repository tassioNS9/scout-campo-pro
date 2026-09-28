"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { timesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const deleteTime = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.delete(timesTable).where(eq(timesTable.id, id));
  revalidatePath("/times");
};

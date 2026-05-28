"use server";

import { headers } from "next/headers";

import { createEstatistica as createEstatisticaQuery } from "@/db/queries";
import type { InsertEstatistica } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createEstatistica = async (data: InsertEstatistica) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await createEstatisticaQuery(data);
};

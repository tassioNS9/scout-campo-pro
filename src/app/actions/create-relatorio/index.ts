"use server";

import { headers } from "next/headers";

import { createRelatorio as createRelatorioQuery } from "@/db/queries";
import type { InsertRelatorio } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createRelatorio = async (data: InsertRelatorio) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await createRelatorioQuery(data);
};

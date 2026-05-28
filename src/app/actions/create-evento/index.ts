"use server";

import { headers } from "next/headers";

import { createEvento as createEventoQuery } from "@/db/queries";
import type { InsertEvento } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createEvento = async (data: InsertEvento) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await createEventoQuery(data);
};

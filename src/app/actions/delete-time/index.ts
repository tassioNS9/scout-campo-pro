"use server";

import { headers } from "next/headers";

import { deleteTime as deleteTimeQuery } from "@/db/queries";
import { auth } from "@/lib/auth";

export const deleteTime = async (id: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await deleteTimeQuery(id);
};

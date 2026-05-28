"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { times } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createTime = async (data: typeof times.$inferInsert) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  await db.insert(times).values(data).returning();

  redirect("/times");
};

"use server";

import { getTimesAll } from "@/db/queries";

export const listTimes = async () => {
  return await getTimesAll();
};

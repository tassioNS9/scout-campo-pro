"use server";

import { getTimeById as getTimeByIdQuery } from "@/db/queries";

export const getTimeById = async (id: number) => {
  return await getTimeByIdQuery(id);
};

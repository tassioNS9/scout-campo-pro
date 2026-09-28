"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { timesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-storage";

import { createTimeSchema } from "./schema";

export async function createTime(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 1. Extrai e valida os campos do FormData
  const dados = createTimeSchema.safeParse({
    nome: formData.get("nome"),
    categoria: formData.get("categoria"),
    cidade: formData.get("cidade"),
    estado: formData.get("estado"),
    escudo:
      formData.get("escudo") instanceof File &&
      (formData.get("escudo") as File).size > 0
        ? formData.get("escudo")
        : undefined,
  });

  if (!dados.success) {
    return { sucesso: false, erros: z.flattenError(dados.error).fieldErrors };
  }

  const { nome, categoria, cidade, estado, escudo } = dados.data;

  // 2. Cria o time primeiro (sem escudo ainda) — precisa do id pro path do Storage
  const [time] = await db
    .insert(timesTable)
    .values({ userId: session.user.id, nome, categoria, cidade, estado })
    .returning();

  // 3. Se enviou escudo, faz upload e atualiza o registro
  if (escudo) {
    const extensao = escudo.type.split("/")[1];
    const path = `times/${time.id}/escudo.${extensao}`;
    console.log("Path do escudo:", path);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("escudos-times")
      .upload(path, escudo, { upsert: true, contentType: escudo.type });
    console.log("Resultado do upload do escudo:", { uploadError });

    if (uploadError) {
      // time já foi criado, mas o escudo falhou — não desfaz o time,
      // só avisa que o upload deu erro (usuário pode tentar de novo depois)
      return {
        sucesso: true,
        timeId: time.id,
        avisoEscudo:
          "Time criado, mas houve falha ao enviar o escudo. Tente novamente na edição.",
      };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("escudos-times")
      .getPublicUrl(path);

    await db
      .update(timesTable)
      .set({ escudoUrl: publicUrlData.publicUrl, escudoPath: path })
      .where(eq(timesTable.id, time.id));
  }

  revalidatePath("/times");
  return { sucesso: true, timeId: time.id };
}

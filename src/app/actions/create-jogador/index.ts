"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { db } from "@/db";
import { jogadoresTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-storage";

import { createJogadorSchema } from "./schema";

export const createJogador = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const dados = createJogadorSchema.safeParse({
    idTime: formData.get("idTime"),
    numero: formData.get("numero"),
    nome: formData.get("nome"),
    idade: formData.get("idade"),
    posicao: formData.get("posicao"),
    foto:
      formData.get("foto") instanceof File &&
      (formData.get("foto") as File).size > 0
        ? formData.get("foto")
        : undefined,
  });

  if (!dados.success) {
    return { sucesso: false, erros: z.flattenError(dados.error).fieldErrors };
  }

  const { idTime, numero, nome, idade, posicao, foto } = dados.data;

  const [jogador] = await db
    .insert(jogadoresTable)
    .values({
      idTime,
      numero,
      nome,
      idade,
      posicao,
    })
    .returning();

  try {
    // 3. Se enviou foto, faz upload e atualiza o registro
    if (foto) {
      const extensao = foto.type.split("/")[1];
      const path = `jogadores/${jogador.id}/foto.${extensao}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("escudos-times")
        .upload(path, foto, { upsert: true, contentType: foto.type });

      if (uploadError) {
        return {
          sucesso: true,
          jogadorId: jogador.id,
          avisoFoto:
            "Jogador criado, mas houve falha ao enviar a foto. Tente novamente na edição.",
        };
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("escudos-times")
        .getPublicUrl(path);

      await db
        .update(jogadoresTable)
        .set({ fotoUrl: publicUrlData.publicUrl, fotoPath: path })
        .where(eq(jogadoresTable.id, jogador.id));
    }

    return { sucesso: true, jogadorId: jogador.id };
  } catch (error) {
    console.error("Erro ao finalizar criação do jogador:", error);
    return {
      sucesso: true,
      jogadorId: jogador.id,
      avisoFoto: "Jogador criado, mas houve um problema ao salvar a foto.",
    };
  } finally {
    // 4. Revalida a rota de jogadores para refletir a mudança
    revalidatePath("/jogador");
  }
};

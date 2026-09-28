// features/partidas/actions/get-partidas-lista.ts
import { db } from "@/db";

export async function getPartidasSelect() {
  const partidas = await db.query.partidas.findMany({
    columns: {
      id: true,
      nome: true, // ou home/away, data, etc — só o que aparece no seletor
      data: true,
    },
    orderBy: (p, { desc }) => [desc(p.data)],
  });

  return partidas;
}

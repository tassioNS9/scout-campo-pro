import { and, desc, eq } from "drizzle-orm";

import { db } from "./index";
import {
  estatisticas,
  eventos,
  heatmaps,
  jogadores,
  partidas,
  posseBola,
  pressao,
  recuperacoes,
  relatorios,
  times,
} from "./schema";

// Times queries
export async function createTime(data: typeof times.$inferInsert) {
  const result = await db.insert(times).values(data).returning();
  return result[0];
}

export async function getTimesAll() {
  return await db.select().from(times).orderBy(times.nome);
}

export async function getTimeById(id: number) {
  const result = await db.select().from(times).where(eq(times.id, id)).limit(1);
  return result[0];
}

export async function updateTime(
  id: number,
  data: Partial<typeof times.$inferInsert>,
) {
  const result = await db
    .update(times)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(times.id, id))
    .returning();
  return result[0];
}

export async function deleteTime(id: number) {
  return await db.delete(times).where(eq(times.id, id));
}

// Jogadores queries
export async function createJogador(data: typeof jogadores.$inferInsert) {
  const result = await db.insert(jogadores).values(data).returning();
  return result[0];
}

export async function getJogadoresByTime(idTime: number) {
  return await db
    .select()
    .from(jogadores)
    .where(eq(jogadores.idTime, idTime))
    .orderBy(jogadores.numero);
}

export async function getJogadorById(id: number) {
  const result = await db
    .select()
    .from(jogadores)
    .where(eq(jogadores.id, id))
    .limit(1);
  return result[0];
}

export async function updateJogador(
  id: number,
  data: Partial<typeof jogadores.$inferInsert>,
) {
  const result = await db
    .update(jogadores)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(jogadores.id, id))
    .returning();
  return result[0];
}

export async function deleteJogador(id: number) {
  return await db.delete(jogadores).where(eq(jogadores.id, id));
}

// Partidas queries
export async function createPartida(data: typeof partidas.$inferInsert) {
  const result = await db.insert(partidas).values(data).returning();
  return result[0];
}

export async function getPartidas() {
  return await db.select().from(partidas).orderBy(desc(partidas.data));
}

export async function getPartidaById(id: number) {
  const result = await db
    .select()
    .from(partidas)
    .where(eq(partidas.id, id))
    .limit(1);
  return result[0];
}

export type DashboardByPartidaData = {
  partidaId: number;
  resumo: {
    jogos: number;
    vitorias: number;
    empates: number;
    derrotas: number;
  };
  gerais: {
    posseBola: number;
    gols: number;
    assistencias: number;
    finalizacoes: number;
    desarmes: number;
  };
  distribuicaoEventos: {
    gols: number;
    assistencias: number;
    finalizacoes: number;
    desarmes: number;
  };
};

function countEventosByTipo(
  lista: Array<{ tipoEvento: string | null }>,
  tipo: string,
) {
  return lista.reduce((total, item) => {
    return total + (item.tipoEvento === tipo ? 1 : 0);
  }, 0);
}

export async function getDashboardByPartida(
  idPartida: number,
): Promise<DashboardByPartidaData | null> {
  const partida = await getPartidaById(idPartida);

  if (!partida) {
    return null;
  }

  const [eventosPartida, possePartida] = await Promise.all([
    db
      .select({ tipoEvento: eventos.tipoEvento })
      .from(eventos)
      .where(eq(eventos.idPartida, idPartida)),
    getPosseBolaByPartida(idPartida),
  ]);

  const gols = countEventosByTipo(eventosPartida, "Gol");
  const assistencias = countEventosByTipo(eventosPartida, "Assistência");
  const finalizacoes =
    countEventosByTipo(eventosPartida, "Finalização Certa") +
    countEventosByTipo(eventosPartida, "Finalização Errada");
  const desarmes = countEventosByTipo(eventosPartida, "Desarme");

  const placarTimeA = partida.placarTimeA ?? 0;
  const placarTimeB = partida.placarTimeB ?? 0;
  const vitorias = placarTimeA > placarTimeB ? 1 : 0;
  const empates = placarTimeA === placarTimeB ? 1 : 0;
  const derrotas = placarTimeA < placarTimeB ? 1 : 0;

  const posseTimeA = possePartida?.timeA ?? 0;
  const posseTimeB = possePartida?.timeB ?? 0;
  const totalPosse = posseTimeA + posseTimeB;
  const posseBola =
    totalPosse > 0 ? Math.round((posseTimeA / totalPosse) * 100) : 0;

  return {
    partidaId: partida.id,
    resumo: {
      jogos: 1,
      vitorias,
      empates,
      derrotas,
    },
    gerais: {
      posseBola,
      gols,
      assistencias,
      finalizacoes,
      desarmes,
    },
    distribuicaoEventos: {
      gols,
      assistencias,
      finalizacoes,
      desarmes,
    },
  };
}

export async function updatePartida(
  id: number,
  data: Partial<typeof partidas.$inferInsert>,
) {
  const result = await db
    .update(partidas)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partidas.id, id))
    .returning();
  return result[0];
}

// Eventos queries
export async function createEvento(data: typeof eventos.$inferInsert) {
  const result = await db.insert(eventos).values(data).returning();
  return result[0];
}

export async function getEventosByPartida(idPartida: number) {
  return await db
    .select()
    .from(eventos)
    .where(eq(eventos.idPartida, idPartida))
    .orderBy(eventos.minuto);
}

export async function getEventosByJogadorPartida(
  idJogador: number,
  idPartida: number,
) {
  return await db
    .select()
    .from(eventos)
    .where(
      and(eq(eventos.idJogador, idJogador), eq(eventos.idPartida, idPartida)),
    )
    .orderBy(eventos.minuto);
}

// Estatisticas queries
export async function createEstatistica(
  data: typeof estatisticas.$inferInsert,
) {
  const result = await db.insert(estatisticas).values(data).returning();
  return result[0];
}

export async function getEstatisticasByPartida(idPartida: number) {
  return await db
    .select()
    .from(estatisticas)
    .where(eq(estatisticas.idPartida, idPartida))
    .orderBy(desc(estatisticas.nota));
}

export async function getEstatisticasByJogadorPartida(
  idJogador: number,
  idPartida: number,
) {
  const result = await db
    .select()
    .from(estatisticas)
    .where(
      and(
        eq(estatisticas.idJogador, idJogador),
        eq(estatisticas.idPartida, idPartida),
      ),
    )
    .limit(1);
  return result[0];
}

export async function updateEstatistica(
  id: number,
  data: Partial<typeof estatisticas.$inferInsert>,
) {
  const result = await db
    .update(estatisticas)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(estatisticas.id, id))
    .returning();
  return result[0];
}

// Heatmaps queries
export async function createHeatmap(data: typeof heatmaps.$inferInsert) {
  const result = await db.insert(heatmaps).values(data).returning();
  return result[0];
}

export async function getHeatmapByJogadorPartida(
  idJogador: number,
  idPartida: number,
) {
  const result = await db
    .select()
    .from(heatmaps)
    .where(
      and(eq(heatmaps.idJogador, idJogador), eq(heatmaps.idPartida, idPartida)),
    )
    .limit(1);
  return result[0];
}

export async function updateHeatmap(
  id: number,
  data: Partial<typeof heatmaps.$inferInsert>,
) {
  const result = await db
    .update(heatmaps)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(heatmaps.id, id))
    .returning();
  return result[0];
}

// Posse de Bola queries
export async function createPosseBola(data: typeof posseBola.$inferInsert) {
  const result = await db.insert(posseBola).values(data).returning();
  return result[0];
}

export async function getPosseBolaByPartida(idPartida: number) {
  const result = await db
    .select()
    .from(posseBola)
    .where(eq(posseBola.idPartida, idPartida))
    .limit(1);
  return result[0];
}

export async function updatePosseBola(
  id: number,
  data: Partial<typeof posseBola.$inferInsert>,
) {
  const result = await db
    .update(posseBola)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posseBola.id, id))
    .returning();
  return result[0];
}

// Pressao queries
export async function createPressao(data: typeof pressao.$inferInsert) {
  const result = await db.insert(pressao).values(data).returning();
  return result[0];
}

export async function getPressaoByPartida(idPartida: number) {
  const result = await db
    .select()
    .from(pressao)
    .where(eq(pressao.idPartida, idPartida))
    .limit(1);
  return result[0];
}

export async function updatePressao(
  id: number,
  data: Partial<typeof pressao.$inferInsert>,
) {
  const result = await db
    .update(pressao)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(pressao.id, id))
    .returning();
  return result[0];
}

// Recuperacoes queries
export async function createRecuperacao(
  data: typeof recuperacoes.$inferInsert,
) {
  const result = await db.insert(recuperacoes).values(data).returning();
  return result[0];
}

export async function getRecuperacaoByPartida(idPartida: number) {
  const result = await db
    .select()
    .from(recuperacoes)
    .where(eq(recuperacoes.idPartida, idPartida))
    .limit(1);
  return result[0];
}

export async function updateRecuperacao(
  id: number,
  data: Partial<typeof recuperacoes.$inferInsert>,
) {
  const result = await db
    .update(recuperacoes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(recuperacoes.id, id))
    .returning();
  return result[0];
}

// Relatorios queries
export async function createRelatorio(data: typeof relatorios.$inferInsert) {
  const result = await db.insert(relatorios).values(data).returning();
  return result[0];
}

export async function getRelatorioByPartida(idPartida: number) {
  const result = await db
    .select()
    .from(relatorios)
    .where(eq(relatorios.idPartida, idPartida))
    .limit(1);
  return result[0];
}

export async function updateRelatorio(
  id: number,
  data: Partial<typeof relatorios.$inferInsert>,
) {
  const result = await db
    .update(relatorios)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(relatorios.id, id))
    .returning();
  return result[0];
}

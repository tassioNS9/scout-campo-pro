import { and, count, desc, eq, sql, sum } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

import { db } from "./index";
import {
  estatisticasTable,
  eventosTable,
  jogadoresTable,
  partidasTable,
  relatoriosTable,
  timesTable,
} from "./schema";

// Times queries

export async function updateTime(
  id: number,
  data: Partial<typeof timesTable.$inferInsert>,
) {
  const result = await db
    .update(timesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(timesTable.id, id))
    .returning();
  return result[0];
}

export async function getTimesAll() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return await db.query.timesTable.findMany({
    where: eq(timesTable.userId, session.user.id),
  });
}

export async function getTimeById(id: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const result = await db.query.timesTable.findFirst({
    where: and(eq(timesTable.id, id), eq(timesTable.userId, session.user.id)),
    with: {
      jogadores: true,
    },
  });
  return result;
}

export async function getPlayerCount(idTime: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select({ count: count() })
    .from(jogadoresTable)
    .where(eq(jogadoresTable.idTime, idTime));
  return result;
}

// Jogadores queries
export async function createJogador(data: typeof jogadoresTable.$inferInsert) {
  const result = await db.insert(jogadoresTable).values(data).returning();
  return result[0];
}

export async function getJogadoresByTime(idTime: number) {
  return await db.query.jogadoresTable.findMany({
    where: eq(jogadoresTable.idTime, idTime),
    orderBy: jogadoresTable.nome,
  });
}

export async function getJogadorById(id: number) {
  const [jogador] = await db
    .select({
      id: jogadoresTable.id,
      nome: jogadoresTable.nome,
      numero: jogadoresTable.numero,
      posicao: jogadoresTable.posicao,
      idade: jogadoresTable.idade,
      idTime: jogadoresTable.idTime,
      totalPartidas: count(estatisticasTable.idPartida),
      totalNota: sum(estatisticasTable.nota),
    })
    .from(jogadoresTable)
    .leftJoin(
      estatisticasTable,
      eq(jogadoresTable.id, estatisticasTable.idJogador),
    )
    .where(eq(jogadoresTable.id, id))
    .groupBy(jogadoresTable.id);
  return jogador;
}

export async function updateJogador(
  id: number,
  data: Partial<typeof jogadoresTable.$inferInsert>,
) {
  const result = await db
    .update(jogadoresTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(jogadoresTable.id, id))
    .returning();
  return result[0];
}

// Partidas queries
export async function createPartida(data: typeof partidasTable.$inferInsert) {
  const result = await db.insert(partidasTable).values(data).returning();
  return result[0];
}

const partidaSelectShape = {
  id: partidasTable.id,
  data: partidasTable.data,
  idTime: partidasTable.idTime,
  nomeTime: timesTable.nome,
  nomeTimeAdversario: partidasTable.nomeTimeAdversario,
  placarTime: partidasTable.placarTime,
  placarTimeAdversario: partidasTable.placarTimeAdversario,
  status: partidasTable.status,
  resultado: partidasTable.resultado,
  campeonato: partidasTable.campeonato,
  categoria: partidasTable.categoria,
} as const;

export async function getPartidas() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  return db
    .select(partidaSelectShape)
    .from(partidasTable)
    .innerJoin(timesTable, eq(partidasTable.idTime, timesTable.id))
    .where(eq(timesTable.userId, session.user.id))
    .orderBy(desc(partidasTable.data));
}

export async function getPartidaById(partidaId: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [row] = await db
    .select(partidaSelectShape)
    .from(partidasTable)
    .innerJoin(timesTable, eq(partidasTable.idTime, timesTable.id))
    .where(
      and(
        eq(partidasTable.id, partidaId),
        eq(timesTable.userId, session.user.id),
      ),
    )
    .limit(1);

  return row; // já é o objeto "achatado" com nomeTime, ou undefined
}

// Tipo único, derivado da query — reaproveitado nos dois casos
export type Partida = Awaited<ReturnType<typeof getPartidas>>[number];

function contadoresPorTipoEvento() {
  return {
    gols: sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Gol')`.mapWith(
      Number,
    ),
    golsContra:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'GolContra')`.mapWith(
        Number,
      ),
    assistencias:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Assistencia')`.mapWith(
        Number,
      ),
    desarmes:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'Desarme')`.mapWith(
        Number,
      ),
    faltasCometidas:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FaltaCometida')`.mapWith(
        Number,
      ),
    faltasSofridas:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'FaltaSofrida')`.mapWith(
        Number,
      ),
    cartoesAmarelos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'cartaoAmarelo')`.mapWith(
        Number,
      ),
    cartoesVermelhos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'cartaoVermelho')`.mapWith(
        Number,
      ),
    penaltisCometidos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'CometerPenalti')`.mapWith(
        Number,
      ),
    penaltisSofridos:
      sql<number>`count(*) filter (where ${eventosTable.tipoEvento} = 'SofrerPenalti')`.mapWith(
        Number,
      ),
  };
}

export async function getHistoricoTotalJogador(idJogador: number) {
  // 1. Total de eventos do jogador somando TODAS as partidas

  // Gera um `count(*) filter (where tipoEvento = 'X')` para cada tipo do enum
  const [perfil] = await db
    .select({
      nome: jogadoresTable.nome,
      idade: jogadoresTable.idade,
      numero: jogadoresTable.numero,
      posicao: jogadoresTable.posicao,
      fotoUrl: jogadoresTable.fotoUrl,
    })
    .from(jogadoresTable)
    .where(eq(jogadoresTable.id, idJogador))
    .limit(1);

  const [eventos] = await db
    .select(contadoresPorTipoEvento())
    .from(eventosTable)
    .where(eq(eventosTable.idJogador, idJogador));

  const [nota] = await db
    .select({ nota: estatisticasTable.nota })
    .from(estatisticasTable)
    .where(eq(estatisticasTable.idJogador, idJogador));

  const [{ totalPartidas }] = await db
    .select({ totalPartidas: count() })
    .from(estatisticasTable)
    .where(eq(estatisticasTable.idJogador, idJogador));

  return {
    perfil,
    eventos,
    totalPartidas,
    nota: nota?.nota ?? null,
  };
}

export async function getHistoricoPartidasPorJogador(idJogador: number) {
  const partidas = await db
    .select({
      idPartida: partidasTable.id,
      data: partidasTable.data,
      adversario: partidasTable.nomeTimeAdversario,
      placarTime: partidasTable.placarTime,
      placarAdversario: partidasTable.placarTimeAdversario,
      resultado: partidasTable.resultado,
      casaOuFora: partidasTable.casaOuFora,
      ...contadoresPorTipoEvento(),
    })
    .from(eventosTable)
    .innerJoin(partidasTable, eq(eventosTable.idPartida, partidasTable.id))
    .where(eq(eventosTable.idJogador, idJogador))
    .groupBy(
      partidasTable.id,
      partidasTable.data,
      partidasTable.nomeTimeAdversario,
      partidasTable.placarTime,
      partidasTable.placarTimeAdversario,
      partidasTable.resultado,
      partidasTable.casaOuFora,
    )
    .orderBy(partidasTable.data);

  return partidas;
  // [{ idPartida: 1, placarTime: 2, resultado: "Vitoria", gols: 1, desarmes: 1, cartoesAmarelos: 1, ... }, ...]
}

export async function updatePartida(
  id: number,
  data: Partial<typeof partidasTable.$inferInsert>,
) {
  const result = await db
    .update(partidasTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partidasTable.id, id))
    .returning();
  return result[0];
}

// Eventos queries
export async function createEvento(data: typeof eventosTable.$inferInsert) {
  const result = await db.insert(eventosTable).values(data).returning();
  return result[0];
}

export async function getEventosByPartida(idPartida: number) {
  return await db
    .select()
    .from(eventosTable)
    .where(eq(eventosTable.idPartida, idPartida))
    .orderBy(eventosTable.minuto);
}

export async function getEventosByJogadorPartida(
  idJogador: number,
  idPartida: number,
) {
  return await db
    .select()
    .from(eventosTable)
    .where(
      and(
        eq(eventosTable.idJogador, idJogador),
        eq(eventosTable.idPartida, idPartida),
      ),
    )
    .orderBy(eventosTable.minuto);
}

export async function getEstatisticasByJogador(idJogador: number) {
  return await db
    .select()
    .from(estatisticasTable)
    .where(eq(estatisticasTable.idJogador, idJogador));
}

export async function getEstatisticasByJogadorPartida(idJogador: number) {
  const result = await db
    .select()
    .from(estatisticasTable)
    .where(and(eq(estatisticasTable.idJogador, idJogador)));

  return result;
}

export async function updateEstatistica(
  id: number,
  data: Partial<typeof estatisticasTable.$inferInsert>,
) {
  const result = await db
    .update(estatisticasTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(estatisticasTable.id, id))
    .returning();
  return result[0];
}

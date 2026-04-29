import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import * as db from "@/db/queries";
import { auth } from "@/lib/auth";

const categoriaSchema = z.enum(["Sub-13", "Sub-15", "Sub-17", "Profissional"]);
const posicaoSchema = z.enum([
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
]);
const statusPartidaSchema = z.enum(["planejada", "em_andamento", "finalizada"]);
const tipoEventoSchema = z.enum([
  "Finalização Certa",
  "Finalização Errada",
  "Assistência",
  "Passe Decisivo",
  "Drible Certo",
  "Drible Errado",
  "Cruzamento",
  "Desarme",
  "Interceptação",
  "Ganho de Bola",
  "Perda de Bola",
  "Falta",
  "Duelo Ganho",
  "Duelo Perdido",
  "Gol",
]);
const tempoSchema = z.enum(["1T", "2T"]);
const zonaSchema = z.enum(["Defesa", "Meio", "Ataque"]);

async function getSessionUser(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return session?.user ?? null;
}

function parseGetInput(req: NextRequest) {
  const rawInput = req.nextUrl.searchParams.get("input");
  if (!rawInput) return {};

  try {
    return JSON.parse(rawInput) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function parseBody(req: NextRequest) {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function unauthorized() {
  return NextResponse.json(
    { message: "Você precisa estar autenticado para realizar esta ação." },
    { status: 401 },
  );
}

async function runQuery(
  path: string,
  input: Record<string, unknown>,
  req: NextRequest,
) {
  switch (path) {
    case "auth/me": {
      return await getSessionUser(req);
    }
    case "times/list": {
      return await db.getTimesAll();
    }
    case "times/getById": {
      const payload = z.object({ id: z.number() }).parse(input);
      return await db.getTimeById(payload.id);
    }
    case "jogadores/listByTime": {
      const payload = z.object({ idTime: z.number() }).parse(input);
      return await db.getJogadoresByTime(payload.idTime);
    }
    case "jogadores/getById": {
      const payload = z.object({ id: z.number() }).parse(input);
      return await db.getJogadorById(payload.id);
    }
    case "partidas/list": {
      return await db.getPartidas();
    }
    case "partidas/getById": {
      const payload = z.object({ id: z.number() }).parse(input);
      return await db.getPartidaById(payload.id);
    }
    case "dashboard/getByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getDashboardByPartida(payload.idPartida);
    }
    case "eventos/listByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getEventosByPartida(payload.idPartida);
    }
    case "eventos/listByJogadorPartida": {
      const payload = z
        .object({ idJogador: z.number(), idPartida: z.number() })
        .parse(input);
      return await db.getEventosByJogadorPartida(
        payload.idJogador,
        payload.idPartida,
      );
    }
    case "estatisticas/listByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getEstatisticasByPartida(payload.idPartida);
    }
    case "estatisticas/getByJogadorPartida": {
      const payload = z
        .object({ idJogador: z.number(), idPartida: z.number() })
        .parse(input);
      return await db.getEstatisticasByJogadorPartida(
        payload.idJogador,
        payload.idPartida,
      );
    }
    case "heatmaps/getByJogadorPartida": {
      const payload = z
        .object({ idJogador: z.number(), idPartida: z.number() })
        .parse(input);
      return await db.getHeatmapByJogadorPartida(
        payload.idJogador,
        payload.idPartida,
      );
    }
    case "posseBola/getByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getPosseBolaByPartida(payload.idPartida);
    }
    case "pressao/getByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getPressaoByPartida(payload.idPartida);
    }
    case "recuperacoes/getByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getRecuperacaoByPartida(payload.idPartida);
    }
    case "relatorios/getByPartida": {
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.getRelatorioByPartida(payload.idPartida);
    }
    default:
      return null;
  }
}

async function runMutation(
  path: string,
  input: Record<string, unknown>,
  req: NextRequest,
) {
  const user = await getSessionUser(req);

  switch (path) {
    case "times/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          nome: z.string().min(1),
          categoria: categoriaSchema,
          cidade: z.string().optional(),
          estado: z.string().optional(),
        })
        .parse(input);
      return await db.createTime(payload);
    }
    case "times/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          nome: z.string().optional(),
          categoria: categoriaSchema.optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateTime(id, data);
    }
    case "times/delete": {
      if (!user) return unauthorized();
      const payload = z.object({ id: z.number() }).parse(input);
      return await db.deleteTime(payload.id);
    }
    case "jogadores/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          nome: z.string().min(1),
          numero: z.number().int().positive(),
          posicao: posicaoSchema,
          idade: z.number().int().optional(),
          idTime: z.number(),
        })
        .parse(input);
      return await db.createJogador(payload);
    }
    case "jogadores/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          nome: z.string().optional(),
          numero: z.number().int().positive().optional(),
          posicao: posicaoSchema.optional(),
          idade: z.number().int().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateJogador(id, data);
    }
    case "jogadores/delete": {
      if (!user) return unauthorized();
      const payload = z.object({ id: z.number() }).parse(input);
      return await db.deleteJogador(payload.id);
    }
    case "partidas/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          timeA: z.number(),
          timeB: z.number(),
          data: z.coerce.date(),
          campeonato: z.string().optional(),
          categoria: categoriaSchema,
          formacao: z.string().optional(),
        })
        .parse(input);
      return await db.createPartida(payload);
    }
    case "partidas/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          placarTimeA: z.number().int().optional(),
          placarTimeB: z.number().int().optional(),
          status: statusPartidaSchema.optional(),
          formacao: z.string().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updatePartida(id, data);
    }
    case "eventos/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          idPartida: z.number(),
          idJogador: z.number(),
          tipoEvento: tipoEventoSchema,
          minuto: z.number().int(),
          tempo: tempoSchema,
          zona: zonaSchema.optional(),
          detalhes: z.string().optional(),
        })
        .parse(input);
      return await db.createEvento(payload);
    }
    case "estatisticas/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({ idJogador: z.number(), idPartida: z.number() })
        .parse(input);
      return await db.createEstatistica(payload);
    }
    case "estatisticas/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          finalizacaoCerta: z.number().int().optional(),
          finalizacaoErrada: z.number().int().optional(),
          assistencias: z.number().int().optional(),
          passesDecisvos: z.number().int().optional(),
          dribloCerto: z.number().int().optional(),
          dribleErrado: z.number().int().optional(),
          cruzamentos: z.number().int().optional(),
          desarmes: z.number().int().optional(),
          interceptacoes: z.number().int().optional(),
          ganhoBola: z.number().int().optional(),
          perdaBola: z.number().int().optional(),
          faltas: z.number().int().optional(),
          duelosGanhos: z.number().int().optional(),
          duelosPerdidos: z.number().int().optional(),
          gols: z.number().int().optional(),
          nota: z.string().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateEstatistica(id, data);
    }
    case "heatmaps/create": {
      if (!user) return unauthorized();
      const payload = z
        .object({ idJogador: z.number(), idPartida: z.number() })
        .parse(input);
      return await db.createHeatmap(payload);
    }
    case "heatmaps/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          defesa: z.number().int().optional(),
          meio: z.number().int().optional(),
          ataque: z.number().int().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateHeatmap(id, data);
    }
    case "posseBola/create": {
      if (!user) return unauthorized();
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.createPosseBola(payload);
    }
    case "posseBola/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          timeA: z.number().int().optional(),
          timeB: z.number().int().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updatePosseBola(id, data);
    }
    case "pressao/create": {
      if (!user) return unauthorized();
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.createPressao(payload);
    }
    case "pressao/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          timeA: z.number().int().optional(),
          timeB: z.number().int().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updatePressao(id, data);
    }
    case "recuperacoes/create": {
      if (!user) return unauthorized();
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.createRecuperacao(payload);
    }
    case "recuperacoes/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          timeA: z.number().int().optional(),
          timeB: z.number().int().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateRecuperacao(id, data);
    }
    case "relatorios/create": {
      if (!user) return unauthorized();
      const payload = z.object({ idPartida: z.number() }).parse(input);
      return await db.createRelatorio(payload);
    }
    case "relatorios/update": {
      if (!user) return unauthorized();
      const payload = z
        .object({
          id: z.number(),
          melhorJogador: z.number().optional(),
          analiseAoVivo: z.string().optional(),
          sugestoesAoVivo: z.string().optional(),
          pdfUrl: z.string().optional(),
        })
        .parse(input);
      const { id, ...data } = payload;
      return await db.updateRelatorio(id, data);
    }
    default:
      return null;
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const endpoint = path.join("/");

  try {
    const result = await runQuery(endpoint, parseGetInput(req), req);

    if (result === null) {
      return NextResponse.json(
        { message: "Rota não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(result ?? null);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Payload inválido.", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro interno." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const endpoint = path.join("/");

  try {
    const input = await parseBody(req);
    const result = await runMutation(endpoint, input, req);

    if (result instanceof NextResponse) {
      return result;
    }

    if (result === null) {
      return NextResponse.json(
        { message: "Rota não encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json(result ?? null);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Payload inválido.", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Erro interno." },
      { status: 500 },
    );
  }
}

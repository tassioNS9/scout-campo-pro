import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";

import type {
  Estatistica,
  Evento,
  Jogador,
  Partida,
  Relatorio,
  Time,
} from "@/db/schema";

type Categoria = "Sub-13" | "Sub-15" | "Sub-17" | "Profissional";
type Posicao =
  | "Goleiro"
  | "Zagueiro"
  | "Lateral"
  | "Volante"
  | "Meia"
  | "Atacante";
type TipoEvento =
  | "Finalização Certa"
  | "Finalização Errada"
  | "Assistência"
  | "Passe Decisivo"
  | "Drible Certo"
  | "Drible Errado"
  | "Cruzamento"
  | "Desarme"
  | "Interceptação"
  | "Ganho de Bola"
  | "Perda de Bola"
  | "Falta"
  | "Duelo Ganho"
  | "Duelo Perdido"
  | "Gol";

type Zona = "Defesa" | "Meio" | "Ataque";
type TempoPartida = "1T" | "2T";
type StatusPartida = "planejada" | "em_andamento" | "finalizada";

type TimeCreateInput = {
  nome: string;
  categoria: Categoria;
  cidade?: string;
  estado?: string;
};

type TimeUpdateInput = {
  id: number;
  nome?: string;
  categoria?: Categoria;
  cidade?: string;
  estado?: string;
};

type JogadorCreateInput = {
  nome: string;
  numero: number;
  posicao: Posicao;
  idade?: number;
  idTime: number;
};

type JogadorUpdateInput = {
  id: number;
  nome?: string;
  numero?: number;
  posicao?: Posicao;
  idade?: number;
};

type PartidaCreateInput = {
  time: string;
  timeAdversario: string;
  data: Date;
  campeonato?: string;
  categoria: Categoria;
  formacao?: string;
};

type PartidaUpdateInput = {
  id: number;
  placarTimeA?: number;
  placarTimeB?: number;
  status?: StatusPartida;
  formacao?: string;
};

type EventoCreateInput = {
  idPartida: number;
  idJogador: number;
  tipoEvento: TipoEvento;
  minuto: number;
  tempo: TempoPartida;
  zona?: Zona;
  detalhes?: string;
};

type EstatisticaCreateInput = { idJogador: number; idPartida: number };

type EstatisticaUpdateInput = {
  id: number;
  finalizacaoCerta?: number;
  finalizacaoErrada?: number;
  assistencias?: number;
  passesDecisvos?: number;
  dribloCerto?: number;
  dribleErrado?: number;
  cruzamentos?: number;
  desarmes?: number;
  interceptacoes?: number;
  ganhoBola?: number;
  perdaBola?: number;
  faltas?: number;
  duelosGanhos?: number;
  duelosPerdidos?: number;
  gols?: number;
  nota?: string;
};

type RelatorioCreateInput = { idPartida: number };
type RelatorioUpdateInput = {
  id: number;
  melhorJogador?: number;
  analiseAoVivo?: string;
  sugestoesAoVivo?: string;
  pdfUrl?: string;
};
type DashboardByPartidaInput = { idPartida: number };
type DashboardByPartidaData = {
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

type QueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  "mutationFn"
>;

function makeUrl(path: string, input?: unknown) {
  const params = new URLSearchParams();
  if (input !== undefined) {
    params.set("input", JSON.stringify(input));
  }
  const query = params.toString();
  return `/api/rpc/${path}${query ? `?${query}` : ""}`;
}

async function request<TData>(
  path: string,
  method: "GET" | "POST",
  input?: unknown,
): Promise<TData> {
  const response = await fetch(
    method === "GET" ? makeUrl(path, input) : `/api/rpc/${path}`,
    {
      method,
      credentials: "include",
      headers:
        method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: method === "POST" ? JSON.stringify(input ?? {}) : undefined,
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(payload?.message ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as TData;
}

function endpoint<
  TQueryInput = void,
  TQueryOutput = unknown,
  TMutationInput = void,
  TMutationOutput = unknown,
>(path: string) {
  return {
    useQuery: (
      ...args: TQueryInput extends void
        ? [QueryOptions<TQueryOutput>?]
        : [TQueryInput, QueryOptions<TQueryOutput>?]
    ) => {
      const input = (args.length > 0 ? args[0] : undefined) as
        | TQueryInput
        | undefined;
      const options = (args.length === 2 ? args[1] : args[0]) as
        | QueryOptions<TQueryOutput>
        | undefined;

      return useQuery<TQueryOutput, Error>({
        queryKey: [path, input] as const,
        queryFn: () => request<TQueryOutput>(path, "GET", input),
        ...options,
      });
    },
    useMutation: (options?: MutationOptions<TMutationOutput, TMutationInput>) =>
      useMutation<TMutationOutput, Error, TMutationInput>({
        mutationFn: (input: TMutationInput) =>
          request<TMutationOutput>(path, "POST", input),
        ...options,
      }),
  };
}

export const api = {
  auth: {
    me: endpoint<void, unknown>("auth/me"),
  },
  times: {
    list: endpoint<void, Time[]>("times/list"),
    getById: endpoint<{ id: number }, Time | undefined>("times/getById"),
    create: endpoint<void, never, TimeCreateInput, Time>("times/create"),
    update: endpoint<void, never, TimeUpdateInput, Time | undefined>(
      "times/update",
    ),
    delete: endpoint<void, never, { id: number }, unknown>("times/delete"),
  },
  jogadores: {
    listByTime: endpoint<{ idTime: number }, Jogador[]>("jogadores/listByTime"),
    getById: endpoint<{ id: number }, Jogador | undefined>("jogadores/getById"),
    create: endpoint<void, never, JogadorCreateInput, Jogador>(
      "jogadores/create",
    ),
    update: endpoint<void, never, JogadorUpdateInput, Jogador | undefined>(
      "jogadores/update",
    ),
    delete: endpoint<void, never, { id: number }, unknown>("jogadores/delete"),
  },
  partidas: {
    list: endpoint<void, Partida[]>("partidas/list"),
    getById: endpoint<{ id: number }, Partida | undefined>("partidas/getById"),
    create: endpoint<void, never, PartidaCreateInput, Partida>(
      "partidas/create",
    ),
    update: endpoint<void, never, PartidaUpdateInput, Partida | undefined>(
      "partidas/update",
    ),
  },
  dashboard: {
    getByPartida: endpoint<
      DashboardByPartidaInput,
      DashboardByPartidaData | null
    >("dashboard/getByPartida"),
  },
  eventos: {
    listByPartida: endpoint<{ idPartida: number }, Evento[]>(
      "eventos/listByPartida",
    ),
    listByJogadorPartida: endpoint<
      { idJogador: number; idPartida: number },
      Evento[]
    >("eventos/listByJogadorPartida"),
    create: endpoint<void, never, EventoCreateInput, Evento>("eventos/create"),
  },
  estatisticas: {
    listByPartida: endpoint<{ idPartida: number }, Estatistica[]>(
      "estatisticas/listByPartida",
    ),
    getByJogadorPartida: endpoint<
      { idJogador: number; idPartida: number },
      Estatistica | undefined
    >("estatisticas/getByJogadorPartida"),
    create: endpoint<void, never, EstatisticaCreateInput, Estatistica>(
      "estatisticas/create",
    ),
    update: endpoint<
      void,
      never,
      EstatisticaUpdateInput,
      Estatistica | undefined
    >("estatisticas/update"),
  },
  relatorios: {
    getByPartida: endpoint<{ idPartida: number }, Relatorio | undefined>(
      "relatorios/getByPartida",
    ),
    create: endpoint<void, never, RelatorioCreateInput, Relatorio>(
      "relatorios/create",
    ),
    update: endpoint<void, never, RelatorioUpdateInput, Relatorio | undefined>(
      "relatorios/update",
    ),
  },
};

import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Better-auth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").default("user").notNull(),
  profileType: text("profileType").default("Analista").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Enums
export const categoriaEnum = pgEnum("categoria", [
  "Sub-13",
  "Sub-15",
  "Sub-17",
  "Profissional",
]);

export const posicaoEnum = pgEnum("posicao", [
  "Goleiro",
  "Zagueiro",
  "Lateral",
  "Volante",
  "Meia",
  "Atacante",
]);

export const statusPartidaEnum = pgEnum("status_partida", [
  "planejada",
  "em_andamento",
  "finalizada",
]);

export const resultadoEnum = pgEnum("resultado", [
  "Vitória",
  "Derrota",
  "Empate",
  "Sem Resultado",
]);

export const tipoEventoEnum = pgEnum("tipo_evento", [
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

export const zonaEnum = pgEnum("zona", ["Defesa", "Meio", "Ataque"]);

export const tempoEnum = pgEnum("tempo_partida", ["1T", "2T"]);

// Times table
export const times = pgTable("times", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull().unique(),
  categoria: categoriaEnum("categoria").notNull(),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Time = typeof times.$inferSelect;
export type InsertTime = typeof times.$inferInsert;

// Jogadores table
export const jogadores = pgTable("jogadores", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull().unique(),
  numero: integer("numero").notNull(),
  posicao: posicaoEnum("posicao").notNull(),
  idade: integer("idade"),
  idTime: integer("idTime")
    .notNull()
    .references(() => times.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Jogador = typeof jogadores.$inferSelect;
export type InsertJogador = typeof jogadores.$inferInsert;

// Partidas table
export const partidas = pgTable("partidas", {
  id: serial("id").primaryKey(),
  time: varchar("timeA", { length: 100 }).notNull(),
  timeAdversario: varchar("timeB", { length: 100 }).notNull(),
  data: timestamp("data").notNull(),
  campeonato: varchar("campeonato", { length: 100 }),
  categoria: categoriaEnum("categoria").notNull(),
  formacao: varchar("formacao", { length: 50 }),
  placarTimeA: integer("placarTimeA").default(0),
  placarTimeB: integer("placarTimeB").default(0),
  status: statusPartidaEnum("status").default("planejada"),
  resultado: resultadoEnum("resultado").default("Sem Resultado"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Partida = typeof partidas.$inferSelect;
export type InsertPartida = typeof partidas.$inferInsert;

// Eventos table
export const eventos = pgTable("eventos", {
  id: serial("id").primaryKey(),
  idPartida: integer("idPartida")
    .notNull()
    .references(() => partidas.id, { onDelete: "cascade" }),
  idJogador: integer("idJogador")
    .notNull()
    .references(() => jogadores.id, { onDelete: "cascade" }),
  tipoEvento: tipoEventoEnum("tipoEvento").notNull(),
  minuto: integer("minuto").notNull(),
  tempo: tempoEnum("tempo").notNull(),
  zona: zonaEnum("zona"),
  detalhes: text("detalhes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

// Estatisticas table
export const estatisticas = pgTable("estatisticas", {
  id: serial("id").primaryKey(),
  idJogador: integer("idJogador")
    .notNull()
    .references(() => jogadores.id, { onDelete: "cascade" }),
  idPartida: integer("idPartida")
    .notNull()
    .references(() => partidas.id, { onDelete: "cascade" }),
  finalizacaoCerta: integer("finalizacaoCerta").default(0),
  finalizacaoErrada: integer("finalizacaoErrada").default(0),
  assistencias: integer("assistencias").default(0),
  dribleCerto: integer("dribleCerto").default(0),
  dribleErrado: integer("dribleErrado").default(0),
  cruzamentos: integer("cruzamentos").default(0),
  desarmes: integer("desarmes").default(0),
  interceptacoes: integer("interceptacoes").default(0),
  ganhoBola: integer("ganhoBola").default(0),
  perdaBola: integer("perdaBola").default(0),
  faltas: integer("faltas").default(0),
  gols: integer("gols").default(0),
  nota: decimal("nota", { precision: 3, scale: 1 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Estatistica = typeof estatisticas.$inferSelect;
export type InsertEstatistica = typeof estatisticas.$inferInsert;

// Relatorios table
export const relatorios = pgTable("relatorios", {
  id: serial("id").primaryKey(),
  idPartida: integer("idPartida")
    .notNull()
    .references(() => partidas.id, { onDelete: "cascade" }),
  melhorJogador: integer("melhorJogador").references(() => jogadores.id, {
    onDelete: "set null",
  }),
  analiseAoVivo: text("analiseAoVivo"),
  sugestoesAoVivo: text("sugestoesAoVivo"),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Relatorio = typeof relatorios.$inferSelect;
export type InsertRelatorio = typeof relatorios.$inferInsert;

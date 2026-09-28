import {
  boolean,
  char,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

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
  "Sub-17",
  "Sub-20",
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
  "Vitoria",
  "Derrota",
  "Empate",
  "Sem_Resultado",
]);

export const casaOuForaEnum = pgEnum("casa_ou_fora", ["casa", "fora"]);

export const tipoEventoEnum = pgEnum("tipo_evento", [
  "Assistencia",
  "Desarme",
  "FaltaCometida",
  "FaltaSofrida",
  "Gol",
  "GolContra",
  "cartaoAmarelo",
  "cartaoVermelho",
  "CometerPenalti",
  "SofrerPenalti",
]);

export const tempoEnum = pgEnum("tempo_partida", ["1T", "2T"]);

// Times table
export const timesTable = pgTable("times", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 100 }).notNull().unique(),
  categoria: categoriaEnum("categoria").notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  estado: char("estado", { length: 2 }).notNull(),
  escudoUrl: text("escudoUrl"), // <- novo campo
  escudoPath: text("escudoPath"), // <- caminho no bucket, útil pra deletar depois
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Time = typeof timesTable.$inferSelect;
export type InsertTime = typeof timesTable.$inferInsert;

export const userTableRelations = relations(user, ({ many }) => ({
  times: many(timesTable),
}));

// Jogadores table
export const jogadoresTable = pgTable("jogadores", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  numero: integer("numero").notNull(),
  posicao: posicaoEnum("posicao").notNull(),
  idade: integer("idade").notNull(),
  idTime: integer("idTime")
    .notNull()
    .references(() => timesTable.id, { onDelete: "cascade" }),
  fotoUrl: text("fotoUrl"), // <- novo campo
  fotoPath: text("fotoPath"), // <- caminho no bucket, útil pra deletar depois
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Jogador = typeof jogadoresTable.$inferSelect;
export type InsertJogador = typeof jogadoresTable.$inferInsert;

// UMA única definição de relations por tabela
export const timesTableRelations = relations(timesTable, ({ many }) => ({
  jogadores: many(jogadoresTable),
  partidas: many(partidasTable),
}));

// Partidas table
export const partidasTable = pgTable("partidas", {
  id: serial("id").primaryKey(),
  idTime: integer("idTime")
    .notNull()
    .references(() => timesTable.id, { onDelete: "cascade" }),
  nomeTimeAdversario: varchar("nomeTimeAdversario", { length: 100 }).notNull(),
  data: timestamp("data").notNull(),
  campeonato: varchar("campeonato", { length: 100 }),
  categoria: categoriaEnum("categoria").notNull(),
  casaOuFora: casaOuForaEnum("casaOuFora").default("casa").notNull(),
  placarTime: integer("placarTime").default(0).notNull(),
  placarTimeAdversario: integer("placarTimeAdversario").default(0).notNull(),
  status: statusPartidaEnum("status").default("planejada"),
  resultado: resultadoEnum("resultado").default("Sem_Resultado"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type Partida = typeof partidasTable.$inferSelect;
export type InsertPartida = typeof partidasTable.$inferInsert;

// Eventos table
export const eventosTable = pgTable("eventos", {
  id: serial("id").primaryKey(),
  idPartida: integer("idPartida")
    .notNull()
    .references(() => partidasTable.id, { onDelete: "cascade" }),
  idJogador: integer("idJogador")
    .notNull()
    .references(() => jogadoresTable.id, { onDelete: "cascade" }),
  tipoEvento: tipoEventoEnum("tipoEvento").notNull(),
  minuto: integer("minuto").notNull(),
  tempo: tempoEnum("tempo").notNull(),
  detalhes: text("detalhes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Evento = typeof eventosTable.$inferSelect;
export type InsertEvento = typeof eventosTable.$inferInsert;

export const eventosTableRelations = relations(eventosTable, ({ one }) => ({
  partida: one(partidasTable, {
    fields: [eventosTable.idPartida],
    references: [partidasTable.id],
  }),
  jogador: one(jogadoresTable, {
    fields: [eventosTable.idJogador],
    references: [jogadoresTable.id],
  }),
}));

// Estatisticas table
export const estatisticasTable = pgTable(
  "estatisticas",
  {
    id: serial("id").primaryKey(),
    idJogador: integer("idJogador")
      .notNull()
      .references(() => jogadoresTable.id, { onDelete: "cascade" }),
    idPartida: integer("idPartida")
      .notNull()
      .references(() => partidasTable.id, { onDelete: "cascade" }),
    nota: real("nota").default(6.0).notNull(), // Começa na nota base e mudou para 'real'
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    unique("jogador_partida_unique").on(table.idJogador, table.idPartida),
  ],
);

export const jogadoresTableRelations = relations(
  jogadoresTable,
  ({ one, many }) => ({
    time: one(timesTable, {
      fields: [jogadoresTable.idTime],
      references: [timesTable.id],
    }),
    eventos: many(eventosTable),
    estatisticas: many(estatisticasTable),
  }),
);

export const partidasTableRelations = relations(
  partidasTable,
  ({ one, many }) => ({
    time: one(timesTable, {
      fields: [partidasTable.idTime],
      references: [timesTable.id],
    }),
    estatisticas: many(estatisticasTable),
    eventos: many(eventosTable),
  }),
);

export type Estatistica = typeof estatisticasTable.$inferSelect;
export type InsertEstatistica = typeof estatisticasTable.$inferInsert;

export const estatisticasTableRelations = relations(
  estatisticasTable,
  ({ one }) => ({
    jogador: one(jogadoresTable, {
      fields: [estatisticasTable.idJogador],
      references: [jogadoresTable.id],
    }),
    partida: one(partidasTable, {
      fields: [estatisticasTable.idPartida],
      references: [partidasTable.id],
    }),
  }),
);

// Relatorios table
export const relatoriosTable = pgTable("relatorios", {
  id: serial("id").primaryKey(),
  idPartida: integer("idPartida")
    .notNull()
    .references(() => partidasTable.id, { onDelete: "cascade" }),
  melhorJogador: integer("melhorJogador").references(() => jogadoresTable.id, {
    onDelete: "set null",
  }),
  analiseAoVivo: text("analiseAoVivo"),
  sugestoesAoVivo: text("sugestoesAoVivo"),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Relatorio = typeof relatoriosTable.$inferSelect;
export type InsertRelatorio = typeof relatoriosTable.$inferInsert;

export const relatoriosTableRelations = relations(
  relatoriosTable,
  ({ one }) => ({
    partida: one(partidasTable, {
      fields: [relatoriosTable.idPartida],
      references: [partidasTable.id],
    }),
  }),
);

CREATE TYPE "public"."casa_ou_fora" AS ENUM('casa', 'fora');--> statement-breakpoint
CREATE TYPE "public"."categoria" AS ENUM('Sub-17', 'Sub-20', 'Profissional');--> statement-breakpoint
CREATE TYPE "public"."posicao" AS ENUM('Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante');--> statement-breakpoint
CREATE TYPE "public"."resultado" AS ENUM('Vitoria', 'Derrota', 'Empate', 'Sem_Resultado');--> statement-breakpoint
CREATE TYPE "public"."status_partida" AS ENUM('planejada', 'em_andamento', 'finalizada');--> statement-breakpoint
CREATE TYPE "public"."tempo_partida" AS ENUM('1T', '2T');--> statement-breakpoint
CREATE TYPE "public"."tipo_evento" AS ENUM('Assistencia', 'Desarme', 'FaltaCometida', 'FaltaSofrida', 'Gol', 'GolContra', 'cartaoAmarelo', 'cartaoVermelho', 'CometerPenalti', 'SofrerPenalti');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "estatisticas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idJogador" integer NOT NULL,
	"idPartida" integer NOT NULL,
	"nota" real DEFAULT 6 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jogador_partida_unique" UNIQUE("idJogador","idPartida")
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"idJogador" integer NOT NULL,
	"tipoEvento" "tipo_evento" NOT NULL,
	"minuto" integer NOT NULL,
	"tempo" "tempo_partida" NOT NULL,
	"detalhes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jogadores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"numero" integer NOT NULL,
	"posicao" "posicao" NOT NULL,
	"idade" integer NOT NULL,
	"idTime" integer NOT NULL,
	"fotoUrl" text,
	"fotoPath" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partidas" (
	"id" serial PRIMARY KEY NOT NULL,
	"idTime" integer NOT NULL,
	"nomeTimeAdversario" varchar(100) NOT NULL,
	"data" timestamp NOT NULL,
	"campeonato" varchar(100),
	"categoria" "categoria" NOT NULL,
	"casaOuFora" "casa_ou_fora" DEFAULT 'casa' NOT NULL,
	"placarTime" integer DEFAULT 0 NOT NULL,
	"placarTimeAdversario" integer DEFAULT 0 NOT NULL,
	"status" "status_partida" DEFAULT 'planejada',
	"resultado" "resultado" DEFAULT 'Sem_Resultado',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relatorios" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"melhorJogador" integer,
	"analiseAoVivo" text,
	"sugestoesAoVivo" text,
	"pdfUrl" varchar(500),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "times" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"nome" varchar(100) NOT NULL,
	"categoria" "categoria" NOT NULL,
	"cidade" varchar(100) NOT NULL,
	"estado" char(2) NOT NULL,
	"escudoUrl" text,
	"escudoPath" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "times_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"profileType" text DEFAULT 'Analista' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estatisticas" ADD CONSTRAINT "estatisticas_idJogador_jogadores_id_fk" FOREIGN KEY ("idJogador") REFERENCES "public"."jogadores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estatisticas" ADD CONSTRAINT "estatisticas_idPartida_partidas_id_fk" FOREIGN KEY ("idPartida") REFERENCES "public"."partidas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idPartida_partidas_id_fk" FOREIGN KEY ("idPartida") REFERENCES "public"."partidas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_idJogador_jogadores_id_fk" FOREIGN KEY ("idJogador") REFERENCES "public"."jogadores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jogadores" ADD CONSTRAINT "jogadores_idTime_times_id_fk" FOREIGN KEY ("idTime") REFERENCES "public"."times"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partidas" ADD CONSTRAINT "partidas_idTime_times_id_fk" FOREIGN KEY ("idTime") REFERENCES "public"."times"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_idPartida_partidas_id_fk" FOREIGN KEY ("idPartida") REFERENCES "public"."partidas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_melhorJogador_jogadores_id_fk" FOREIGN KEY ("melhorJogador") REFERENCES "public"."jogadores"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "times" ADD CONSTRAINT "times_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
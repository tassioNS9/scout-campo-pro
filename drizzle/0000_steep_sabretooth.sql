CREATE TYPE "public"."categoria" AS ENUM('Sub-13', 'Sub-15', 'Sub-17', 'Profissional');--> statement-breakpoint
CREATE TYPE "public"."posicao" AS ENUM('Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Atacante');--> statement-breakpoint
CREATE TYPE "public"."status_partida" AS ENUM('planejada', 'em_andamento', 'finalizada');--> statement-breakpoint
CREATE TYPE "public"."tempo_partida" AS ENUM('1T', '2T');--> statement-breakpoint
CREATE TYPE "public"."tipo_evento" AS ENUM('Finalização Certa', 'Finalização Errada', 'Assistência', 'Passe Decisivo', 'Drible Certo', 'Drible Errado', 'Cruzamento', 'Desarme', 'Interceptação', 'Ganho de Bola', 'Perda de Bola', 'Falta', 'Duelo Ganho', 'Duelo Perdido', 'Gol');--> statement-breakpoint
CREATE TYPE "public"."zona" AS ENUM('Defesa', 'Meio', 'Ataque');--> statement-breakpoint
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
	"finalizacaoCerta" integer DEFAULT 0,
	"finalizacaoErrada" integer DEFAULT 0,
	"assistencias" integer DEFAULT 0,
	"passesDecisvos" integer DEFAULT 0,
	"dribloCerto" integer DEFAULT 0,
	"dribleErrado" integer DEFAULT 0,
	"cruzamentos" integer DEFAULT 0,
	"desarmes" integer DEFAULT 0,
	"interceptacoes" integer DEFAULT 0,
	"ganhoBola" integer DEFAULT 0,
	"perdaBola" integer DEFAULT 0,
	"faltas" integer DEFAULT 0,
	"duelosGanhos" integer DEFAULT 0,
	"duelosPerdidos" integer DEFAULT 0,
	"gols" integer DEFAULT 0,
	"nota" numeric(3, 1) DEFAULT '0',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"idJogador" integer NOT NULL,
	"tipoEvento" "tipo_evento" NOT NULL,
	"minuto" integer NOT NULL,
	"tempo" "tempo_partida" NOT NULL,
	"zona" "zona",
	"detalhes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "heatmaps" (
	"id" serial PRIMARY KEY NOT NULL,
	"idJogador" integer NOT NULL,
	"idPartida" integer NOT NULL,
	"defesa" integer DEFAULT 0,
	"meio" integer DEFAULT 0,
	"ataque" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jogadores" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"numero" integer NOT NULL,
	"posicao" "posicao" NOT NULL,
	"idade" integer,
	"idTime" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partidas" (
	"id" serial PRIMARY KEY NOT NULL,
	"timeA" integer NOT NULL,
	"timeB" integer NOT NULL,
	"data" timestamp NOT NULL,
	"campeonato" varchar(255),
	"categoria" "categoria" NOT NULL,
	"formacao" varchar(50),
	"placarTimeA" integer DEFAULT 0,
	"placarTimeB" integer DEFAULT 0,
	"status" "status_partida" DEFAULT 'planejada',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posseBola" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"timeA" integer DEFAULT 0,
	"timeB" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pressao" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"timeA" integer DEFAULT 0,
	"timeB" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recuperacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"idPartida" integer NOT NULL,
	"timeA" integer DEFAULT 0,
	"timeB" integer DEFAULT 0,
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
	"nome" varchar(255) NOT NULL,
	"categoria" "categoria" NOT NULL,
	"cidade" varchar(255),
	"estado" varchar(2),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp NOT NULL,
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
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
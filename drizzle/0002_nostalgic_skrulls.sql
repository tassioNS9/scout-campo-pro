CREATE TYPE "public"."resultado" AS ENUM('Vitória', 'Derrota', 'Empate', 'Sem Resultado');--> statement-breakpoint
ALTER TABLE "heatmaps" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "posseBola" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "pressao" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "recuperacoes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "heatmaps" CASCADE;--> statement-breakpoint
DROP TABLE "posseBola" CASCADE;--> statement-breakpoint
DROP TABLE "pressao" CASCADE;--> statement-breakpoint
DROP TABLE "recuperacoes" CASCADE;--> statement-breakpoint
ALTER TABLE "jogadores" ALTER COLUMN "nome" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "partidas" ALTER COLUMN "timeA" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "partidas" ALTER COLUMN "timeB" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "partidas" ALTER COLUMN "campeonato" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "times" ALTER COLUMN "nome" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "times" ALTER COLUMN "cidade" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "partidas" ADD COLUMN "resultado" "resultado" DEFAULT 'Sem Resultado';--> statement-breakpoint
ALTER TABLE "times" ADD CONSTRAINT "times_nome_unique" UNIQUE("nome");
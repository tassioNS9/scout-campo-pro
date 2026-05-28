ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "estatisticas" ADD COLUMN "dribleCerto" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "estatisticas" DROP COLUMN "passesDecisvos";--> statement-breakpoint
ALTER TABLE "estatisticas" DROP COLUMN "dribloCerto";--> statement-breakpoint
ALTER TABLE "estatisticas" DROP COLUMN "duelosGanhos";--> statement-breakpoint
ALTER TABLE "estatisticas" DROP COLUMN "duelosPerdidos";
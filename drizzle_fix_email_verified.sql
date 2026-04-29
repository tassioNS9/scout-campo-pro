ALTER TABLE "user" ALTER COLUMN "emailVerified" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "emailVerified" TYPE boolean USING CASE WHEN "emailVerified" IS NULL THEN false ELSE true END;
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DEFAULT false;

ALTER TABLE "users" DROP CONSTRAINT "users_slug_key";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "slug";
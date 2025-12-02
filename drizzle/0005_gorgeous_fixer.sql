CREATE TYPE "public"."user_role" AS ENUM('admin', 'user', 'manager');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;
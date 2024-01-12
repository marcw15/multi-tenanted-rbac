CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"applicationId" uuid,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_applicationId_pk" PRIMARY KEY("email","applicationId")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_uid_index" ON "users" ("id");
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

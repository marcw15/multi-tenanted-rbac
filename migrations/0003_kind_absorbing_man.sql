CREATE TABLE IF NOT EXISTS "usersToRoles" (
	"applicationId" uuid NOT NULL,
	"roleID" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "usersToRoles_applicationId_roleID_userId_pk" PRIMARY KEY("applicationId","roleID","userId")
);

DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_applicationId_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_roleID_roles_id_fk" FOREIGN KEY ("roleID") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

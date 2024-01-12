ALTER TABLE "usersToRoles" RENAME COLUMN "roleID" TO "roleId";
ALTER TABLE "usersToRoles" DROP CONSTRAINT "usersToRoles_roleID_roles_id_fk";

ALTER TABLE "usersToRoles" DROP CONSTRAINT "usersToRoles_applicationId_roleID_userId_pk";
ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_applicationId_roleId_userId_pk" PRIMARY KEY("applicationId","roleId","userId");
DO $$ BEGIN
 ALTER TABLE "usersToRoles" ADD CONSTRAINT "usersToRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

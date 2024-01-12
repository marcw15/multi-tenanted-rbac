import { InferInsertModel, and, eq } from "drizzle-orm";
import argon2 from "argon2";
import { applications, roles, users, usersToRoles } from "../../db/schema";
import { db } from "../../db";

export async function createUser(data: InferInsertModel<typeof users>) {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({
      ...data,
      password: hashedPassword, // It is import that the hashed password comes after ...data. If it is before it the hashed password get's ovewrited as ...data includes the non-hashed password
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applications.id,
    });

  return result[0];
}

export async function getUsersByApplication(applicationId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));
  return result;
}

export async function assignRoleToUser(
  data: InferInsertModel<typeof usersToRoles>
) {
  const result = await db.insert(usersToRoles).values(data).returning();

  return result[0];
}

export async function getUserByEmail({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: users.applicationId,
      roleId: roles.id,
      password: users.password,
      permissions: roles.permissions,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
    // LEFT JOIN
    // FROM usersToRoles
    // ON usersToRoles.userId = users.id
    // AND usersToRoles.applicationId = users.application
    .leftJoin(
      usersToRoles,
      and(
        eq(usersToRoles.userId, users.id),
        eq(usersToRoles.applicationId, users.applicationId)
      )
    )
    //LEFT JOIN
    //FROM roles
    // On roles.id = usersToRoles.roleID
    .leftJoin(roles, eq(roles.id, usersToRoles.roleID));
  if (!result.length) {
    return null;
  }
  const user = result.reduce((acc, curr) => {
    if (!acc.id) {
      // Usually, doing this is a big sin! Using the spread operator (...curr) inside a reduce as well as creating a new Set inside a reduce you want to avoid.
      // Because for every iteration of it, it could create a new object (the object should be mutated instead!)
      // In this example, this is not so bad as we only do it once
      // Once the id is there, the whole block get skipped
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      };
    }

    if (!curr.permissions) {
      return acc;
    }

    for (const permission of curr.permissions) {
      acc.permissions.add(permission);
    }

    return acc;
  }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

  return {
    ...user,
    permissions: Array.from(user.permissions), //Gets all the permissions of all that user roles and merge them into one set and finally create an array from that set, so that there is no risk to get a duplicate permission inside of the permissions
  };
}

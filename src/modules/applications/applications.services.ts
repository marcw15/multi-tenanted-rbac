import { InferInsertModel } from "drizzle-orm";
import { db } from "../../db";
import { applications } from "../../db/schema";

// create application
export async function createApplication(
  data: InferInsertModel<typeof applications> //InferInsertModel as alterntive of InferModel (@deprecated )
) {
  const result = await db.insert(applications).values(data).returning();

  return result[0];
}

export async function getApplications() {
  // SELECT * FROM applications;
  // SELECT id, name, createdAt from applications;
  const result = await db
    .select({
      id: applications.id,
      name: applications.name,
      createdAt: applications.createdAt,
    })
    .from(applications);

    return result;
}

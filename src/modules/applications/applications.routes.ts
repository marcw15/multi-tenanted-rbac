import { FastifyInstance } from "fastify";
import { createApplicationHandler, getApplicationshandler } from "./applications.controllers";
import { createApplicationJsonSchema } from "./applications.schemas";

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: createApplicationJsonSchema,
    },
    createApplicationHandler
  );

  app.get("/", getApplicationshandler);
}

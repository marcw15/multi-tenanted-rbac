import { FastifyReply, FastifyRequest } from "fastify";
import { createApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./applications.services";
import {
  ALL_PERMISSIONS,
  SYTSEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";
import { createRole } from "../roles/roles.services";
import { applications } from "../../db/schema";
//function for post request -> hooked to applications.routes.ts
export async function createApplicationHandler(
  request: FastifyRequest<{ Body: createApplicationBody }>,
  reply: FastifyReply
) {
  const { name } = request.body;
  const application = await createApplication({
    name,
  });

  const superAdminRolePromise = createRole({
    applicationId: application.id,
    name: SYTSEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as Array<string>,
  });

  const applicationUserRolePromise = createRole({
    applicationId: application.id,
    name: SYTSEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });

  const [superAdminRole, applicationUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    applicationUserRolePromise,
  ]);

  if(superAdminRole.status === 'rejected'){
    throw new Error("Error creating super admin role");
  }

  if(applicationUserRole.status === 'rejected'){
    throw new Error("Error creating application user role");
  }

  return {
    application,
    superAdminRole: superAdminRole.value,
    applicationUserRole: applicationUserRole.value,
  };
}


//function for get request -> hooked to applications.routes.ts
export async function getApplicationshandler() {
  return getApplications();
}
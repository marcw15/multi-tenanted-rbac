import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  primaryKey,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => applications.id),
    password: varchar("password", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      cpk: primaryKey({ columns: [users.email, users.applicationId] }),
      idIndex: uniqueIndex("users_uuid_index").on(users.id),
    };
  }
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    applicationId: uuid("applicationId").references(() => applications.id),
    permissions: text("permissions").array().$type<Array<string>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (roles) => {
    return {
      cpk: primaryKey({ columns: [roles.name, roles.applicationId] }),
      idIndex: uniqueIndex("roles_id_index").on(roles.id),
    };
  }
);

export const usersToRoles = pgTable(
  "usersToRoles",
  {
    applicationId: uuid("applicationId")
      .references(() => applications.id)
      .notNull(),
    roleId: uuid("roleId")
      .references(() => roles.id)
      .notNull(),
    userId: uuid("userId")
      .references(() => users.id)
      .notNull(),
  },
  (usersToRoles) => {
    return {
      cpk: primaryKey({
        columns: [
          usersToRoles.applicationId,
          usersToRoles.roleId,
          usersToRoles.userId,
        ],
      }),
    };
  }
);
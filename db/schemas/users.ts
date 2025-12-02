import { pgTable, serial, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Define role enum
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'manager']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  password: varchar('password', { length: 255 }),
  role: userRoleEnum('role').default('user').notNull(), 
});
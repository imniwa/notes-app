import {
  index,
  pgTable,
  uuid,
  text,
  bigserial,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`), 
    fullname: text('fullname').notNull(),
    username: text('username').notNull().unique(),
    hashpass: text('hashpass').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
  },
  (users) => ({
    nameIdx: index("name_idx").on(users.fullname),
  })
);

export const notes = pgTable(
  "notes",
  {
    id: bigserial('id', {mode:"number"}).primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    details: text('details'),
    author: uuid('author').notNull().references(() => users.id),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
  }
)

export const usersRelations = relations(users, ({many}) => ({
  notes: many(notes),
}))

export const notesRelations = relations(notes, ({one}) => ({
  author: one(users, {
    fields: [notes.author],
    references: [users.id],
  }),
}))

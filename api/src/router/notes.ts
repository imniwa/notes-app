import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { db } from "../libs/db";
import { confirmJWT } from "../libs/helpers";
import { notes, users } from "../schema";
import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { getRandomSeed } from "bun:jsc";

export const notesRouter = new Elysia({ prefix: "/notes", tags: ["notes"] })
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRETS!,
    })
  )
  .guard({
    beforeHandle: async ({ bearer, set, jwt }) => {
      if (!bearer) {
        set.status = 401;
        return;
      }
      if (!(await jwt.verify(bearer))) {
        set.status = 401;
        return;
      }
    },
  })
  .get(
    "/",
    async ({ query, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);

      const pages = await db.query.notes.findMany({
        columns: {
          deletedAt: false,
        },
        with: {
          author: {
            columns: {
              username: true,
              fullname: true,
            },
          },
        },
        where: and(eq(notes.author, id), isNull(notes.deletedAt)),
        limit: parseInt(query.limit),
        offset: parseInt(query.page) * parseInt(query.limit),
        orderBy: desc(notes.createdAt),
      });

      return pages;
    },
    {
      query: t.Object({
        page: t.String(),
        limit: t.String(),
        search: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);

      const note = await db.query.notes.findFirst({
        columns: {
          deletedAt: false,
        },
        with: {
          author: {
            columns: {
              username: true,
              fullname: true,
            },
          },
        },
        where: and(eq(notes.id, parseInt(params.id)), eq(notes.author, id)),
      });

      return note;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/",
    async ({ body, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);

      type NewNote = typeof notes.$inferInsert;
      const insertNote = async (note: NewNote) => {
        return db.insert(notes).values(note).returning({
          id: notes.id,
          title: notes.title,
          description: notes.description,
          details: notes.details,
        });
      };

      const newNote: NewNote = {
        author: id,
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const note = await insertNote(newNote);
      set.status = 201;
      return note;
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        details: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);

      const updateNote = await db
        .update(notes)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(and(eq(notes.id, parseInt(params.id)), eq(notes.author, id)))
        .returning({
          id: notes.id,
          title: notes.title,
          description: notes.description,
          details: notes.details,
          updatedAt: notes.updatedAt,
        });

      return updateNote;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        details: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);
      const note = await db
        .update(notes)
        .set({
          deletedAt: new Date(),
        })
        .where(and(eq(notes.id, parseInt(params.id)), eq(notes.author, id)));

      set.status = 204;
      return;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id/hard",
    async ({ params, bearer, jwt, set }) => {
      const { id } = await confirmJWT(bearer, jwt);
      const note = await db
        .delete(notes)
        .where(and(eq(notes.id, parseInt(params.id)), eq(notes.author, id)));

      set.status = 204;
      return;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );

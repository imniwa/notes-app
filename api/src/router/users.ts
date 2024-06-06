import { Elysia, t, NotFoundError, InternalServerError } from "elysia";
import { db } from "../libs/db";
import { users } from "../schema";
import { and, eq, isNull } from "drizzle-orm";
import jwt, { JWTPayloadSpec } from "@elysiajs/jwt";
import bearer from "@elysiajs/bearer";
import { confirmJWT } from "../libs/helpers";

export const usersRouter = new Elysia({ prefix: "/users", tags: ["users"] })
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRETS!,
    })
  )
  .get("/", async ({ bearer, jwt, set }) => {
    const { id } = await confirmJWT(bearer, jwt);
    const findUser = await db
      .select({
        id: users.id,
        fullname: users.fullname,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);
    if (!(findUser.length > 0)) throw new NotFoundError("User not found");
    return findUser[0];
  })
  .get(
    "/:uuid",
    async ({ params }) => {
      const getUser = await db.query.users.findFirst({
        columns: {
          deletedAt: false,
          hashpass: false,
        },
        where: and(eq(users.id, params.uuid), isNull(users.deletedAt)),
      });
      return getUser;
    },
    {
      params: t.Object({
        uuid: t.String({ format: "uuid" }),
      }),
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      type NewUser = typeof users.$inferInsert;
      const insertUser = async (user: NewUser) => {
        return db.insert(users).values(user).returning({
          id: users.id,
          fullname: users.fullname,
          username: users.username,
          createdAt: users.createdAt,
        });
      };

      const hashpass = Bun.password.hashSync(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });

      const newUser: NewUser = {
        fullname: body.fullname,
        username: body.username,
        hashpass: hashpass,
        createdAt: new Date(),
      };

      try {
        const users = await insertUser(newUser);
        set.status = 201;
        return users;
      } catch (error) {
        throw new InternalServerError("Failed to create user");
      }
    },
    {
      body: t.Object({
        fullname: t.String(),
        username: t.String(),
        password: t.String(),
      }),
    }
  )
  .put(
    "/:uuid",
    async ({ body, params, set }) => {
      const user = { ...body };
      if (body.password) {
        const hashpass = Bun.password.hashSync(body.password, {
          algorithm: "bcrypt",
          cost: 10,
        });
        user.password = hashpass;
      }
      const updateUser = await db
        .update(users)
        .set(user)
        .where(eq(users.id, params.uuid))
        .returning({
          id: users.id,
          fullname: users.fullname,
          username: users.username,
          createdAt: users.createdAt,
        });
      return updateUser;
    },
    {
      params: t.Object({
        uuid: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        fullname: t.Optional(t.String()),
        username: t.Optional(t.String()),
        password: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      const deletedUser = await db
        .update(users)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(users.id, params.uuid))
        .returning({ id: users.id });
      return deletedUser;
    },
    {
      params: t.Object({
        uuid: t.String({ format: "uuid" }),
      }),
    }
  )
  .delete(
    "/:uuid/hard",
    async ({ params }) => {
      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, params.uuid))
        .returning({ id: users.id });
      return deletedUser;
    },
    {
      params: t.Object({
        uuid: t.String({ format: "uuid" }),
      }),
    }
  );

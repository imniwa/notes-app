import { Elysia, t } from "elysia";
import { db } from "../libs/db";
import { users } from "../schema";
import { and, eq } from "drizzle-orm";
import jwt from "@elysiajs/jwt";

export const authRouter = new Elysia({ prefix: "/auth", tags: ["auth"] })
  .use(jwt({
    name: "jwt",
    secret: process.env.JWT_SECRETS!,
  }))
  .post(
  "/",
  async ({ body, set, jwt, cookie: { auth } }) => {
    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.username, body.username)));
    
    if (user.length === 0) {
      throw new Error("User not found");
    }

    const eqHashpass = Bun.password.verifySync(body.password, user[0].hashpass);

    if (!eqHashpass) {
      throw new Error("Password is incorrect");
    }

    auth.set({
      value: await jwt.sign({ id: user[0].id }),
      httpOnly: true,
      maxAge: 7 * 86400,
      path: "*",
    });

    return {
      token: auth.value,
    };
  },
  {
    body: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  }
);

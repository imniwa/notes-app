import { authRouter } from "./auth";
import { notesRouter } from "./notes";
import { usersRouter } from "./users";

import { Elysia, t } from "elysia";

const apiRouter = new Elysia({prefix: "/v1"})
  .guard({
    response: t.Object({
      status: t.String(),
      data: t.Any(),
    }),
  })
  .mapResponse(({ response, set }) => {
    switch (set.status) {
      case 201:
        return new Response(
          JSON.stringify({
            status: "created",
            data: response,
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      case 204:
        return new Response(null, {
          status: 204,
          headers: { "Content-Type": "application/json" },
        });
      case 401:
        return new Response(
          JSON.stringify({
            status: "unauthorized",
            data: response,
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "WWW-Authenticate": `Bearer realm='sign', error="invalid_request"`,
            },
          }
        );
      default:
        return new Response(
          JSON.stringify({
            status: "ok",
            data: response,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  })
  .use(authRouter)
  .use(notesRouter)
  .use(usersRouter);

export const router = new Elysia().use(apiRouter).get("/", ({ set }) => {
  set.headers["x-powered-by"] = "imniwa";
  set.redirect = "/api/swagger";
});

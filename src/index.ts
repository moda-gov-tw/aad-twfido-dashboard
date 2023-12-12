import { Hono } from "hono";
import { jwt } from "hono/jwt";

import home from "./controllers/home";
import auth from "./controllers/auth";
import users from "./controllers/users";

type Bindings = {
  AAD_TENANT_ID: string;
  AAD_CLEINT_ID: string;
  AAD_CLEINT_SECRET: string;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/users/*", async (c, next) => {
  const auth = jwt({
    secret: c.env.JWT_SECRET,
    cookie: "JWT",
  });
  return await auth(c, next);
});

app.route("/", home);
app.route("/auth", auth);
app.route("/users", users);


export default app;

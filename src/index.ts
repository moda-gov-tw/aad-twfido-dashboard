import { Hono } from "hono";
import { userId } from "./profile/userId";
import { userIdUpdate } from "./profile/userIdUpdate";
import { userIndex } from "./admin/userIndex";
import { userList } from "./admin/userList";
import { userEdit } from "./admin/userEdit";
import { userUpdate } from "./admin/userUpdate";

type Bindings = {
  AAD_TENANT_ID: string;
  AAD_CLEINT_ID: string;
  AAD_CLEINT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => userId(c));
app.post("/", (c) => userIdUpdate(c));
app.get("/admin", (c) => userIndex(c));
app.get("/admin/users.json", async (c) => await userList(c));
app.get("/admin/:mail", async(c)=> await userEdit(c));
app.post("/admin/:mail", async(c)=> await userUpdate(c));

export default app;

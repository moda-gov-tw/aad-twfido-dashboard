import { Hono } from "hono";
import { Home } from "../views/home";
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'


const app = new Hono();

app.get("/", async(c: any) => {
  const props = {
    title: "Entra ID 自然人憑證管理後台",
    hideLogout: true
  };
  return c.html(<Home {...props} />);
});

export default app;

import { Hono } from "hono";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";

const app = new Hono();

app.get("/login", (c: any) => {
  const u = new URL(c.req.url);
  const url = `https://login.microsoftonline.com/${c.env.AAD_TENANT_ID}/oauth2/v2.0/authorize`;
  const params = new URLSearchParams({
    scope: "user.read",
    response_type: "code",
    client_id: c.env.AAD_CLEINT_ID,
    redirect_uri: `${u.protocol}//${u.host}/auth/entraid/callback`,
  });
  return c.redirect(`${url}?${params}`);
});

app.get("/entraid/callback", async (c: any) => {
  try {
    // 取得 Entra ID Token
    const u = new URL(c.req.url);
    const url = `https://login.microsoftonline.com/${c.env.AAD_TENANT_ID}/oauth2/v2.0/token`;
    const options = {
      method: "POST",
      body: new URLSearchParams({
        client_id: c.env.AAD_CLEINT_ID,
        client_secret: c.env.AAD_CLEINT_SECRET,
        code: c.req.query("code"),
        redirect_uri: `${u.protocol}//${u.host}/auth/entraid/callback`,
        grant_type: "authorization_code",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await fetch(url, options);
    const json: any = await response.json();
    const access_token = json.access_token;

    // 取得 Entra ID 使用者資料
    const me_url =
      "https://graph.microsoft.com/v1.0/me?$select=userPrincipalName&$expand=extensions";
    const me_options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
        "content-type": "application/json",
      },
    };
    const me_response = await fetch(me_url, me_options);
    const me_json: any = await me_response.json();
    const email = me_json.userPrincipalName;
    const twfido = me_json.extensions.find((i: any) => i.id == "twfido") ?? {};

    // 檢查是否有管理員權限
    if (!twfido.admin && email != c.env.ADMIN_EMAIL) {
      return c.text(email + " 無權限訪問");
    }

    // 發放 JWT，期限一天
    const now = new Date();
    const now_ts = Math.floor(now.getTime() / 1000);
    now.setDate(now.getDate() + 1);
    const exp_ts = Math.floor(now.getTime() / 1000);
    const payload = {
      sub: email,
      role: "admin",
      exp: exp_ts,
      iat: now_ts,
      nbf: now_ts,
    };
    const secret = c.env.JWT_SECRET;
    const token = await sign(payload, secret);
    setCookie(c, "JWT", token, {
      secure: true,
      httpOnly: true,
    });
    return c.redirect("/users");
  } catch (err) {
    c.text(err);
  }
});

app.get("/logout", (c: any) => {
  deleteCookie(c, "JWT");
  return c.redirect("/");
});

export default app;

import { Hono } from "hono";
import { UsersList } from "../views/usersList";
import { UsersEdit } from "../views/usersEdit";
import { getAadAccessToken, createExtension } from "../function/functions";
import { sha3_512 } from "js-sha3";

const app = new Hono();

app.get("/", (c: any) => {
  const props = {
    title: "Entra ID 自然人憑證管理後台",
  };
  return c.html(<UsersList {...props} />);
});

app.get("/users.json", async (c: any) => {
  const access_token = await getAadAccessToken(c);
  if (access_token == null) {
    return c.json({ msg: "Failed to get Azure AD access token" });
  }
  const url =
    "https://graph.microsoft.com/v1.0/users?$select=displayName,userPrincipalName&$expand=extensions&$top=999&$filter=accountEnabled eq true";
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };

  try {
    const r = await fetch(url, options);
    let j: any = await r.json();
    j = j.value.filter(
      (i: any) => !i.userPrincipalName.endsWith("onmicrosoft.com")
    );

    j = j.map((i: any) => {
      const obj = i;
      obj.twid = "unset";
      obj.pwd = "unset";
      obj.pwd_expiry = "";
      obj.admin = "";
      obj.sign = "";
      try {
        const find = i.extensions.find((k: any) => k.id == "twfido");
        if (find) {
          obj.twid = find.twid ? "set" : "unset";
          obj.pwd = find.pwd ? "set" : "unset";
          obj.sign = find.sign ? "V" : "";
          obj.pwd_expiry = find.pwd_expiry.replace("T", " ");
          obj.admin = find.admin ? "✅" : "";
        }
      } catch (e) {}
      return obj;
    });

    return c.json({ total: 800, totalNotFiltered: 800, rows: j });
  } catch (err) {
    return c.json({ msg: err });
  }
});

app.get("/:mail", async (c) => {
  const access_token = await getAadAccessToken(c);
  const mail = c.req.param("mail");
  const url = `https://graph.microsoft.com/v1.0/users/${mail}?$select=id,displayName,userPrincipalName&$expand=extensions`;
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };

  try {
    const r = await fetch(url, options);
    const j: any = await r.json();
    const twfido = j.extensions.find((i: any) => i.id == "twfido") ?? {};

    const props = {
      title: "編輯使用者",
      id: j.id,
      mail: j.userPrincipalName,
      name: j.displayName,
      admin: twfido.admin ?? false,
      pwd_expiry: twfido.pwd_expiry ?? "",
    };
    return c.html(<UsersEdit {...props} />);
  } catch (err) {
    return c.text("Error");
  }
});
app.post("/:mail", async (c) => {
  interface Datatype {
    twid: string | null;
    pwd: string | null;
    pwd_expiry: string | null;
    admin: boolean;
  }

  let data: any = {};
  const access_token = await getAadAccessToken(c);
  const mail = c.req.param("mail");
  const url = `https://graph.microsoft.com/v1.0/users/${mail}/extensions/twfido`;
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };

  let r = await fetch(url, options);
  if (r.status == 404) {
    await createExtension(mail, access_token);
  } else {
    const j: any = await r.json();
    data = j;
    data.twid = j.twid ?? null;
    data.pwd = j.pwd ?? null;
    data.pwd_expiry = j.pwd_expiry ?? null;
    data.admin = (j.admin == true) ?? false;
  }
  

  const body = await c.req.parseBody();
  data.pwd_expiry = body.pwd_expiry.toString();
  data.admin = (body.admin == "on");
  if (body.twid) data.twid = sha3_512(body.id.toString() + body.twid.toString());
  if (body.pwd) data.pwd = sha3_512(body.pwd.toString());

  const url2 = `https://graph.microsoft.com/v1.0/users/${mail}/extensions/twfido`;
  const options2 = {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  };
  
  try {
    let r = await fetch(url2, options2);
    return c.redirect("/users");
  } catch (err) {
    return c.json({ msg: err });
  }
});

export default app;

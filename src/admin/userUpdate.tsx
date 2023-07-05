import { getAadAccessToken, createExtension } from "../function/functions";
import { sha3_512 } from "js-sha3";

export async function userUpdate(c: any) {
  interface Datatype {
    twid: string | null;
    pwd: string | null;
    pwd_expiry: string | null;
  }

  const data: Datatype = {
    twid: null,
    pwd: null,
    pwd_expiry: null,
  };

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
    data.twid = j.twid ?? null;
    data.pwd = j.pwd ?? null;
    data.pwd_expiry = j.pwd_expiry ?? null;
  }

  const body = await c.req.parseBody();
  data.pwd_expiry = body.pwd_expiry;
  if (body.twid) data.twid = sha3_512(body.id + body.twid);
  if (body.pwd) data.pwd = sha3_512(body.pwd);

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
    return c.redirect("/");
  } catch (err) {
    return c.json({ msg: err });
  }
}

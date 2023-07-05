import {
  getCfAccessUser,
  getAadAccessToken,
  createExtension,
} from "../function/functions";
import { sha3_512 } from "js-sha3";

export async function userIdUpdate(c: any) {
  const cookie = c.req.header("Cookie");
  const user = {
    name: "測試",
    mail: "test@pdis.dev",
  };
  if (cookie != undefined) {
    const cf_data = await getCfAccessUser(cookie);
    user.name = cf_data.name;
    user.mail = cf_data.email;
  }

  const access_token = await getAadAccessToken(c);
  const url = `https://graph.microsoft.com/v1.0/users/${user.mail}?$select=id,displayName,userPrincipalName&$expand=extensions`;
  const options = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
    },
  };

  let data: any = {};
  const r = await fetch(url, options);
  const json: any = await r.json();
  const id = json.id;

  const find = json.extensions.find((i: any) => i.id == "twfido");
  if (find) {
    data = find;
  } else {
    await createExtension(user.mail, access_token);
  }

  const body = await c.req.parseBody();
  const twid = body.twid;

  data.twid = sha3_512(id + twid);

  const url2 = `https://graph.microsoft.com/v1.0/users/${user.mail}/extensions/twfido`;
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

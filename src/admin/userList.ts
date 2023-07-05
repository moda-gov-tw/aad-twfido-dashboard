import { getAadAccessToken } from "../function/functions";

export async function userList(c: any) {
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
      try {
        const find = i.extensions.find((k: any) => k.id == "twfido");
        if (find) {
          obj.twid = find.twid ? "set" : "unset";
          obj.pwd = find.pwd ? "set" : "unset";
          obj.pwd_expiry = find.pwd_expiry.replace("T", " ");
        }
      } catch (e) {}
      return obj;
    });

    return c.json(j);
  } catch (err) {
    return c.json({ msg: err });
  }
}

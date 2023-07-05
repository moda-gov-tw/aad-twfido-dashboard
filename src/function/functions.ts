export async function getAadAccessToken(c: any): Promise<string | null> {
  const url = `https://login.microsoftonline.com/${c.env.AAD_TENANT_ID}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append("client_id", c.env.AAD_CLEINT_ID);
  params.append("client_secret", c.env.AAD_CLEINT_SECRET);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const options = {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await fetch(url, options);
    const json: any = await response.json();
    return json.access_token;
  } catch (e) {
    return null;
  }
}

export async function createExtension(mail: string, access_token: string | null) {
  const url = `https://graph.microsoft.com/v1.0/users/${mail}/extensions/`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: 'twfido'
    })
  };
  await fetch(url, options);
}


export async function getCfAccessUser(cookie: string): Promise<any> {
  const url = `https://modatw.cloudflareaccess.com/cdn-cgi/access/get-identity`;
  const options = {
    headers: {
      Cookie: cookie
    }
  };
  const f = await fetch(url, options);
  return await f.json();
}
import { Layout } from "../function/layout";
import { getAadAccessToken, getCfAccessUser } from "../function/functions";
import { html } from "hono/html";

export async function userId(c: any) {
  try {
    const cookie = c.req.header('Cookie');
    const user = {
        name: "測試",
        mail: "test@pdis.dev"
    }
    if (cookie != undefined) {
        const cf_data = await getCfAccessUser(cookie);
        user.name = cf_data.name;
        user.mail = cf_data.email;
    }
    
    const access_token = await getAadAccessToken(c);
    let twid = null;
    const url = `https://graph.microsoft.com/v1.0/users/${user.mail}?$select=id,displayName,userPrincipalName&$expand=extensions`;
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };

    const r = await fetch(url, options);
    const j: any = await r.json();
    const find = j.extensions.filter((i: any) => i.id == "twfido");
    if (find.length > 0) {
      twid = find[0].twid;
    }

    const props = {
      title: "設定身分證",
      mail: user.mail,
      name: user.name,
    };
    if (twid == null || user.mail == "test@pdis.dev") {
      return c.html(<Edit {...props} />);
    } else {
      return c.html(<Done {...props} />);
    }
  } catch (err) {
    return c.html(err);
  }
}

const Edit = (props: any) => {
  return (
    <Layout {...props}>
      <h1 class="pb-2 mb-4 border-bottom">{props.title}</h1>
      <p>
        數位發展部資訊處將於7月開始嘗試導入行動自然人憑證作為內部系統身份驗證機制，請同仁協助輸入您的身分證字號。
      </p>
      <form method="POST" onsubmit="return validateForm()">
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">信箱</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="email"
              value={props.mail}
              readonly="readonly"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">姓名</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="text"
              value={props.name}
              readonly="readonly"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">身分證字號</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="text"
              name="twid"
              placeholder="請輸入身分證字號"
              required
            />
          </div>
        </div>
        <button class="btn btn-primary" type="submit">
          儲存
        </button>
      </form>
      {html`
        <script>
          function validateForm() {
            var id = document.querySelector("input[name=twid]").value.trim();
            if (id == "") {
              return true;
            }

            let conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
            let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

            id = String(conver.indexOf(id[0]) + 10) + id.slice(1);

            checkSum = 0;
            for (let i = 0; i < id.length; i++) {
              c = parseInt(id[i]);
              w = weights[i];
              checkSum += c * w;
            }

            if (checkSum % 10 == 0) {
              return true;
            } else {
              alert("身分證字號錯誤");
              return false;
            }
          }
        </script>
      `}
    </Layout>
  );
};

const Done = (props: any) => {
  return (
    <Layout {...props}>
      <h1 class="pb-2 mb-4 border-bottom">{props.title}</h1>
      <p>
        {props.name}
        已設定身分證字號，若要修改身分證字號請聯絡資訊處it@moda.gov.tw。
      </p>
    </Layout>
  );
};

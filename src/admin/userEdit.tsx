import { Layout } from "../function/layout";
import { getAadAccessToken } from "../function/functions";
import { html } from "hono/html";

export async function userEdit(c: any) {
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
    const find = j.extensions.filter((i: any) => i.id == "twfido");
    let pwd_expiry = null;

    if (find.length > 0) {
      try {
        pwd_expiry = find[0].pwd_expiry;
      } catch (e) {}
    }

    const props = {
      title: "編輯使用者",
      id: j.id,
      mail: j.userPrincipalName,
      name: j.displayName,
      pwd_expiry: pwd_expiry,
    };
    return c.html(<Edit {...props} />);
  } catch (err) {
    return c.html(err);
  }
}

const Edit = (props: any) => {
  return (
    <Layout {...props}>
      <h1 class="pb-2 mb-4 border-bottom">{props.title}</h1>
      <form method="POST" onsubmit="return validateForm()">
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">信箱</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="email"
              name="email"
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
              name="name"
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
              placeholder="若不修改則空白"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">臨時密碼</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="password"
              autocomplete="new-password"
              name="pwd"
              placeholder="若不修改則空白"
            />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">臨時密碼期限(UTC+0)</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="datetime-local"
              name="pwd_expiry"
              value={props.pwd_expiry}
            />
          </div>
        </div>
        <input type="hidden" value={props.id} name="id" />
        <button class="btn btn-primary" type="submit">
          送出
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

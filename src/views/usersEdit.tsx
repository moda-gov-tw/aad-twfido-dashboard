import { Layout } from "./layout";
import { html } from "hono/html";

export const UsersEdit = (props: any) => {
  return (
    <Layout {...props}>
      <form method="POST" onsubmit="return validateForm()">
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">信箱</label>
          <div class="col-sm-9">
            <input
              class="form-control"
              type="email"
              name="email"
              value={props.mail}
              readonly
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
              readonly
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
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label">管理員</label>
          <div class="col-sm-9">
            {props.admin ? (
              <input
                class="form-check-input mt-2"
                type="checkbox"
                name="admin"
                checked
              />
            ) : (
              <input
                class="form-check-input mt-2"
                type="checkbox"
                name="admin"
              />
            )}
          </div>
        </div>
        <input type="hidden" value={props.id} name="id" />
        <button class="btn btn-success me-2" type="submit">
          送出
        </button>
        <a href="/users" class="btn btn-light">返回</a>
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

import { Layout } from "./layout";
import { html } from "hono/html";

export const UsersList = (props: any) => {
  return (
    <Layout {...props}>
      <table id="table" data-url="users/users.json" data-search="true">
        <thead>
          <tr>
            <th data-field="userPrincipalName" data-sortable="true">
              信箱
            </th>
            <th data-field="displayName" data-sortable="true">
              姓名
            </th>
            <th data-field="twid" data-formatter="twid" data-sortable="true">
              身分證字號
            </th>
            <th data-field="pwd" data-formatter="pwd" data-sortable="true">
              臨時密碼
            </th>
            <th data-field="pwd_expiry" data-sortable="true">
              臨時密碼期限(UTC+0)
            </th>
            <th data-field="sign" data-sortable="true">
              簽章憑證
            </th>
            <th data-field="admin" data-sortable="true">
              管理員
            </th>
            <th data-formatter="link">編輯</th>
          </tr>
        </thead>
      </table>
      {html`
        <script>
          window.onload = function () {
            const urlParams = new URLSearchParams(window.location.search);
            let searchText = urlParams.get("searchText");
            if (searchText == null) {
              searchText = sessionStorage.getItem("searchText");
            }
            $("#table").bootstrapTable({
              searchText: searchText,
            });
            setSearchText(searchText);
            $("input[type=search]").on("keyup", function () {
              setSearchText(this.value);
            });
          };

          function setSearchText(value) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("searchText", value);
            history.pushState(
              {},
              null,
              window.location.pathname + "?" + urlParams
            );
            sessionStorage.setItem("searchText", value);
          }

          function link(value, row) {
            return \`<a href="/users/\${row.userPrincipalName}">編輯</a>\`;
          }
          function twid(value, row) {
            if (value == "set") {
              return '<span class="badge rounded-pill bg-success">已設定</span>';
            } else {
              return '<span class="badge rounded-pill bg-secondary">未設定</span>';
            }
          }
          function pwd(value, row) {
            if (value == "set") {
              if (new Date(row.pwd_expiry) > new Date() || !row.pwd_expiry) {
                return '<span class="badge rounded-pill bg-success">啟用中</span>';
              } else {
                return '<span class="badge rounded-pill bg-danger">已過期</span>';
              }
            } else {
              return '<span class="badge rounded-pill bg-secondary">未設定</span>';
            }
          }
        </script>
      `}
    </Layout>
  );
};

import { Layout } from "../function/layout";
import { html } from "hono/html";

export function userIndex(c: any) {
  const props = {
    title: "行動自然人憑證單一登入管理後台",
  };
  return c.html(<Index {...props} />);
}

const Index = (props: any) => {
  return (
    <Layout {...props}>
      <h1 class="pb-2 border-bottom">{props.title}</h1>
      <table id="table" data-toggle="table" data-url="admin/users.json" data-search="true">
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
            <th data-formatter="link">編輯</th>
          </tr>
        </thead>
      </table>
      {html`
        <script>
          function link(value, row) {
            return \`<a href="/admin/\${row.userPrincipalName}">編輯</a>\`;
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

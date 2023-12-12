import { Layout } from "./layout";

export const Home = (props: any) => {
  return (
    <Layout {...props}>
      <a href="/auth/login" class="btn btn-success">Entra ID 登入</a>
    </Layout>
  );
};

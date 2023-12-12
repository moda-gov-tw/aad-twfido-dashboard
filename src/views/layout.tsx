export const Layout = (props: any) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.22.1/bootstrap-table.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.22.1/bootstrap-table.min.js"></script>
      </head>
      <body>
        <div class="container px-5 py-5">
          <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <a href="/" class="me-auto text-dark text-decoration-none">
              <span class="fs-4">Entra ID 自然人憑證管理後台</span>
            </a>

            <div>
              {props.hideLogout ? null : (
                <a href="/auth/logout" class="btn btn-primary">
                  登出
                </a>
              )}
            </div>
          </header>
          {props.children}
        </div>
      </body>
    </html>
  );
};

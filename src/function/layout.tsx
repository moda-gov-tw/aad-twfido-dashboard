export const Layout = (props: any) => {
  return (
    <html>
        <head>
            <title>{props.title}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.21.2/bootstrap-table.min.css" />
        </head>
        <body>
            <div class="container px-5 py-5">
            <body>{props.children}</body>
            </div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.21.2/bootstrap-table.min.js"></script>
        </body>  
    </html>
  );
};

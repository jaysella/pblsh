import { Fragment } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { toast, Toaster } from "react-hot-toast";
import { globalStyles } from "../shared/styles";

function MyApp({ Component, pageProps }) {
  const { user } = pageProps;

  const Layout = Component.Layout ? Component.Layout : Fragment;

  return (
    <UserProvider user={user}>
      {globalStyles}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        toastOptions={{
          // Define default options
          style: {
            background: "#f5f0f6",
            color: "#031822",
          },
          // Default options for specific types
          success: {
            theme: {
              primary: "#85ffc7",
              secondary: "#031822",
            },
          },
          error: {
            theme: {
              primary: "#ff8552",
              secondary: "#031822",
            },
          },
        }}
      />
    </UserProvider>
  );
}

export default MyApp;

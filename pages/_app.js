import { Fragment } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
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
    </UserProvider>
  );
}

export default MyApp;

import DashboardLayout from "../components/layout/DashboardLayout";
import { UserProvider } from "@auth0/nextjs-auth0";
import { globalStyles } from "../shared/styles";

function MyApp({ Component, pageProps }) {
  const { user } = pageProps;

  const getLayout =
    Component.getLayout || ((page) => <DashboardLayout children={page} />);

  return (
    <UserProvider user={user}>
      {globalStyles}
      {getLayout(<Component {...pageProps} />)}
    </UserProvider>
  );
}

export default MyApp;

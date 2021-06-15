import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useFaunaUser } from "../hooks/useFaunaUser";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

function Settings() {
  const { user } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  return (
    <>
      <Head>
        <title>Settings | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Account Settings</h1>

        <Block>
          <h2>Settings</h2>
          <p>Let's make this account yours. More to come!</p>
        </Block>

        <Block>
          <h2>Password</h2>
          <p>
            To change your password, please log out. When logging back in, click
            "Forgot password?"
          </p>
        </Block>
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Settings));

export const PageWrapper = styled.main`
  margin: 3rem 2.5rem;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media only screen and (min-width: 768px) {
    margin: 0 auto;
  }
`;

export const sectionTitle = css`
  font-size: 0.8em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: var(--color-white-muted);
`;

export const contentBlock = css`
  padding: 1.5rem;
  border-radius: var(--base-border-radius);
  border: var(--base-border-width) solid var(--color-black-muted);
  transition: border calc(var(--base-transition-out-duration) * 2) 0.5s ease-out;

  &:hover {
    transition: border calc(var(--base-transition-in-duration) * 2) ease-in;
  }

  h2 {
    ${sectionTitle};
  }
`;

export const Block = styled.section`
  ${contentBlock};
`;

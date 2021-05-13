import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { useFaunaUser } from "../hooks/useFaunaUser";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

function Pages() {
  const { user } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  return (
    <>
      <Head>
        <title>Pages | pblsh</title>
      </Head>

      <PageWrapper>
        <Block>
          <h2>Pages</h2>
          <p>
            Hey {faunaUserData && faunaUserData.nickname}! This is still in the
            works ;)
          </p>
        </Block>
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Pages));

export const PageWrapper = styled.main`
  margin: 0 auto;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Welcome = styled.div`
  padding: 2rem 5rem 1rem;
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

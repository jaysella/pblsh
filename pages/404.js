import Head from "next/head";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

function Custom404() {
  return (
    <>
      <Head>
        <title>Not Found | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Error 404: Not Found</h1>

        <Block>
          <h2>Ruh Roh</h2>
          <p>We couldn't find what you were looking for.</p>
        </Block>
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(Custom404);

export const PageWrapper = styled.main`
  margin: 3rem auto;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

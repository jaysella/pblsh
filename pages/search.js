// import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
// import { useFaunaUser } from "../hooks/useFaunaUser";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import { fadeInAnimation } from "../shared/styles";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

function Search() {
  // const { user } = useUser();
  // const { faunaUserStatus, faunaUserData } = useFaunaUser();

  return (
    <>
      <Head>
        <title>Search | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Search</h1>

        <Block>
          <p>
            Unfortunately search functionality hasn't yet been implemented.
            Maybe the links below will help you out anyways?
          </p>

          <List>
            <li>
              <Link href="/dashboard">Dashboard</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/new">Craft Something New</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/pages">Pages</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/folders">Folders</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/settings">Account Settings</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
            <li>
              <Link href="/api/auth/logout">Log Out</Link>
              <span>
                <ArrowRightCircleIcon />
              </span>
            </li>
          </List>
        </Block>
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Search));

export const PageWrapper = styled.main`
  margin: 3rem auto;
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

const List = styled.ul`
  padding: 1rem 1.5rem 0;

  li {
    margin: 0.75rem 0;
  }

  span {
    display: none;
    margin-left: 0.35rem;

    svg {
      height: 0.8em;
      width: auto;
    }
  }

  a {
    color: var(--color-primary);

    &:hover {
      text-decoration: underline;

      ~ span {
        display: inline-block;
        animation: ${fadeInAnimation} 0.2s forwards ease-in;
      }
    }
  }
`;

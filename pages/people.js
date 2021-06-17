import { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Head from "next/head";
// import Link from "next/link";
// import toast from "react-hot-toast";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import Loader from "../components/Loader";
import { AlertTriangleIcon } from "../components/Icons";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  // linkStyles,
  // padWithBackgroundStyles,
  // padStyles,
  LoadingWrapper,
  fadeInAnimation,
} from "../shared/styles";

function Pages() {
  const { faunaUserData } = useFaunaUser();

  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [peopleFetched, setPeopleFetched] = useState(false);
  const [peopleData, setPeopleData] = useState();

  useEffect(() => {
    const fetchPeople = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/users`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.users) {
            const data = r.success.users.data;
            setPeopleData(data);
            setPeopleFetched(true);
          } else if (r.error) {
            console.log("Error:", r.error);
            const errorMessage =
              r.error.name === "database_error"
                ? "An error was encountered — please try again later"
                : r.error.message;
            setFaunaFetchingError(errorMessage);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchPeople();
  }, [faunaUserData]);

  return (
    <>
      <Head>
        <title>People | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>People</h1>

        {!peopleFetched && (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        )}

        {faunaFetchingError && (
          <ErrorBlock>
            <WarningIconWrapper>
              <AlertTriangleIcon />
            </WarningIconWrapper>

            <h2>Error Encountered</h2>
            <p>
              {faunaFetchingError ||
                "An error was encountered — please try again later"}
            </p>
          </ErrorBlock>
        )}

        {peopleData && peopleData.length < 1 && (
          <Block>
            <h2>No Pages</h2>
            <p>It&apos;s lonely in here. No people could be found.</p>
          </Block>
        )}

        {peopleFetched && (
          <Block>
            {peopleData && (
              <List>
                {peopleData.map((p) => (
                  <li key={p.ref["@ref"].id}>
                    {p.data.name} (@{p.data.nickname})
                  </li>
                ))}
              </List>
            )}
          </Block>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Pages));

const PageWrapper = styled.main`
  margin: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media only screen and (min-width: 768px) {
    margin: 2rem 5rem;
  }
`;

export const sectionTitle = css`
  font-size: 0.8em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: var(--color-white-muted);
`;

const contentBlock = css`
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

const blockStyles = css`
  ${contentBlock};

  p:not(:first-of-type) {
    margin-top: 0.75rem;
  }
`;

export const Block = styled.section`
  ${blockStyles};
`;

const ErrorBlock = styled.section`
  ${blockStyles};
  border-color: var(--color-tertiary);
`;

const WarningIconWrapper = styled.div`
  margin-bottom: 1.25rem;
  color: var(--color-tertiary);

  svg {
    width: 2.5rem;
    height: auto;
  }
`;

const List = styled.ul`
  padding: 0 1.5rem;

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

  /* a {
    color: var(--color-primary);

    &:hover {
      text-decoration: underline;

      ~ span {
        display: inline-block;
        animation: ${fadeInAnimation} 0.2s forwards ease-in;
      }
    }
  } */
`;

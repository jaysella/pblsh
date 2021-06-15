import { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Head from "next/head";
import Link from "next/link";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import { timeSinceFromTimestamp } from "../helpers/timeSince";
import Loader from "../components/Loader";
import ClockIcon from "../components/svg/Clock";
import FolderIcon from "../components/svg/Folder";
import PlusCircleIcon from "../components/svg/PlusCircle";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  padStyles,
  LoadingWrapper,
} from "../shared/styles";

function Pages() {
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [pagesFetched, setPagesFetched] = useState(false);
  const [pagesData, setPagesData] = useState();

  useEffect(() => {
    const fetchPages = async () => {
      if (faunaUserData && faunaUserData.id) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };

        await fetch(`/api/user/${faunaUserData.id}/pages`, requestOptions)
          .then((response) => response.json())
          .then((r) => {
            if (r.success && r.success.pages) {
              const data = r.success.pages.data;
              setPagesData(data);
              setPagesFetched(true);
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
      }
    };

    fetchPages();
  }, [faunaUserData]);

  return (
    <>
      <Head>
        <title>Pages | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Your Pages</h1>

        {!pagesFetched && (
          <PagesGrid>
            {[0, 1, 2, 3].map((i) => (
              <Block key={i}>
                <LoadingWrapper>
                  <Loader />
                </LoadingWrapper>
              </Block>
            ))}
          </PagesGrid>
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

        {pagesData && pagesData.length < 1 && (
          <Block>
            <h2>No Pages</h2>
            <p>
              It&apos;s lonely in here: you haven&apos;t created any pages yet.
              Let&apos;s fix that.
            </p>
          </Block>
        )}

        {pagesFetched && (
          <>
            <PagesGrid>
              {pagesData &&
                pagesData.map((p) => (
                  <Link
                    href={`/edit/${p.page.ref["@ref"].id}`}
                    passHref
                    key={p.page.ref["@ref"].id}
                  >
                    <Page>
                      <PageName>{p.page.data.title}</PageName>

                      <PageMeta>
                        <PageMetaRow>
                          <ClockIcon />
                          {timeSinceFromTimestamp(
                            p.page.data.updatedAt["@ts"]
                          )}{" "}
                          ago
                        </PageMetaRow>
                        <PageMetaRow>
                          <FolderIcon />
                          {p.folder.data.name}
                        </PageMetaRow>
                      </PageMeta>
                    </Page>
                  </Link>
                ))}

              {faunaUserStatus === "fetched" && (
                <Link href="/new/page" passHref>
                  <CreateNew>
                    <PlusCircleIcon />
                  </CreateNew>
                </Link>
              )}
            </PagesGrid>
          </>
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

const PagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media only screen and (min-width: 768px) {
    margin: 2rem 5rem;
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Page = styled.a`
  ${linkStyles};
  ${padWithBackgroundStyles};

  display: grid;
  grid-template-rows: 1fr auto;
  padding: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
`;

const PageName = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
`;

const PageMeta = styled.div`
  margin-top: 1rem;
  font-size: 0.75em;
  font-weight: var(--font-weight-light);
  align-content: end;
`;

const PageMetaRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.6rem;

  &:not(:last-of-type) {
    margin-bottom: 0.75rem;
  }

  svg {
    width: 14px;
    height: auto;
  }
`;

const CreateNew = styled.a`
  ${linkStyles};
  ${padStyles};

  display: flex;
  align-content: center;
  justify-content: center;
  padding: 1rem;
  border-color: var(--color-primary);
  border-radius: calc(var(--base-border-radius) / 1.5);

  svg {
    width: 2.5rem;
    height: auto;
    color: var(--color-white-muted);
    transition: all var(--base-transition-out-duration) ease-out;
  }

  &:hover {
    background: var(--color-black-muted);

    svg {
      color: var(--color-primary);
      transition: all var(--base-transition-in-duration) ease-in;
    }
  }
`;

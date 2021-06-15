import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { withSimpleLayout } from "../../components/layout/SimpleLayout";
import Tiptap from "../../components/Tiptap";
import Loader from "../../components/Loader";
import AlertTriangleIcon from "../../components/svg/AlertTriangle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { LoadingWrapper } from "../../shared/styles";

function ViewPage() {
  const router = useRouter();
  const { pageId } = router.query;

  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [pageFetched, setPageFetched] = useState(false);
  const [pageData, setPageData] = useState();

  const fetchPage = async () => {
    if (pageId) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/page/${pageId}`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.page) {
            const data = r.success.page.data[0].page.data;
            setPageData(data);
            setPageFetched(true);
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

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  let title;
  if (pageFetched && pageData.published) {
    title = pageData.title;
  } else if (faunaFetchingError || (pageData && pageData.published)) {
    title = "Error";
  } else {
    title = "Loading...";
  }

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        {pageFetched && pageData.published ? (
          <>
            <h1>{title}</h1>

            {pageData.contentTiptap && (
              <Tiptap
                editable={false}
                initialContent={pageData.contentTiptap}
              />
            )}
          </>
        ) : faunaFetchingError || (pageData && pageData.published) ? (
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
        ) : (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        )}
      </PageWrapper>
    </>
  );
}

export default withSimpleLayout(ViewPage);

const PageWrapper = styled.main`
  margin: 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

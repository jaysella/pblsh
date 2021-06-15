import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import styled from "@emotion/styled";

import Custom404 from "../404";
import Tiptap from "../../components/Tiptap";
import Button, { ButtonIcon } from "../../components/Button";
import {
  AlertTriangleIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
} from "../../components/svg/Icons";
import Loader from "../../components/Loader";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import {
  LoadingWrapper,
  WarningIconWrapper,
  ErrorBlock,
} from "../../shared/styles";

function Page() {
  const { user, isLoading } = useUser();

  // Grab pageId from route
  const {
    query: { pageId },
  } = useRouter();

  const [pageFetch, setPageFetch] = useState({
    isLoading: true,
  });
  const [isEditing, setIsEditing] = useState();

  const [tiptapData, setTiptapData] = useState();
  const [pageSave, setPageSave] = useState({
    isSaving: false,
  });

  // Fetch page
  useEffect(() => {
    const fetchPage = async () => {
      if (pageId) {
        const requestOptions = {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        };

        await fetch(`/api/page/${pageId}`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.status >= 400) {
              setPageFetch({
                error: res,
                isLoading: false,
              });
            } else {
              setPageFetch({
                response: res,
                isLoading: false,
              });
            }
          })
          .catch((error) => {
            console.error(error);
            setPageFetch({
              error: {
                error: error.message,
              },
              isLoading: false,
            });
          });
      }
    };

    fetchPage();
  }, [pageId]);

  // Check if currently logged in user owns this page
  let userSub;
  let pageOwnerSub;

  // Confirm user is logged in
  if (user) {
    userSub = user.sub;
  }

  // Parse successful response
  let pageData = {};
  if (pageFetch && pageFetch.response && pageFetch.response.success) {
    pageData = pageFetch.response.success.page.data[0];
    pageOwnerSub = pageData.owner.data.auth0Id;
  }

  useEffect(() => {
    if (userSub && pageOwnerSub && userSub === pageOwnerSub) {
      return setIsEditing(true);
    }

    if (!isLoading && userSub !== pageOwnerSub) {
      return setIsEditing(false);
    }
  }, [userSub, pageOwnerSub, isLoading]);

  if (pageFetch.isLoading) {
    return (
      <>
        <Head>
          <title>Loading... | pblsh</title>
        </Head>
        <PageWrapper>
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        </PageWrapper>
      </>
    );
  }

  // Page does not exist or is not editing AND not published, return 404 page
  if (
    !pageFetch.isLoading &&
    (pageFetch.error || (!isEditing && !pageData.page.data.published))
  ) {
    return <Custom404 />;
  }

  let title;
  if (pageData && (pageData.published === true || isEditing)) {
    title = pageData?.page?.data.title;
  } else if (pageFetch.error) {
    title = "Error";
  }

  // Get Tiptap data from child <Tiptap /> component
  const sendTiptapData = (data) => {
    // the callback
    setTiptapData(data);
  };

  // Save page
  const handlePageSave = async () => {
    let values = {};
    values.contentTiptap = tiptapData;

    if (pageId) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch(`/api/page/${pageId}/edit`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.status >= 400) {
            setPageSave({
              error: res,
              isSaving: false,
            });
          } else {
            setPageSave({
              response: res,
              isSaving: false,
              saved: res.success ? true : false,
            });
          }
        })
        .then(console.log(pageSave))
        .catch((error) => {
          console.error(error);
          setPageSave({
            error: {
              error: error.message,
            },
            isSaving: false,
          });
        });
    }
  };

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>{title}</h1>

        {pageSave?.error ||
          (pageSave?.response?.error && (
            <ErrorBlock>
              <WarningIconWrapper>
                <AlertTriangleIcon />
              </WarningIconWrapper>

              <h2>Error Encountered</h2>
              <p>
                {pageSave.error.message ||
                  pageSave.response.error.message ||
                  "An error was encountered — please try again later"}
              </p>
            </ErrorBlock>
          ))}

        {pageData &&
          pageData?.page?.data?.contentTiptap &&
          typeof isEditing !== "undefined" && (
            <>
              <Tiptap
                editable={isEditing}
                initialContent={pageData.page.data.contentTiptap}
                sendTiptapData={sendTiptapData}
              />

              {isEditing && (
                <Button onClick={handlePageSave} disabled={pageSave.isSaving}>
                  Save
                  <ButtonIcon>
                    {pageSave.isSaving ? (
                      <Loader />
                    ) : pageSave.saved ? (
                      <CheckCircleIcon />
                    ) : (
                      <ArrowRightCircleIcon />
                    )}
                  </ButtonIcon>
                </Button>
              )}
            </>
          )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(Page);

const PageWrapper = styled.main`
  margin: 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

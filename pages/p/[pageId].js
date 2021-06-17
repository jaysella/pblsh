import { useState, useEffect } from "react";
import router, { useRouter } from "next/router";
import { useUser, isLoading } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../../hooks/useFaunaUser";
import Head from "next/head";
import toast from "react-hot-toast";
import styled from "@emotion/styled";

import { copyToClipboard, isEquivalent } from "../../helpers/utilities";
import { timeSinceFromTimestamp } from "../../helpers/timeSince";

import Custom404 from "../404";
import Link from "next/link";
import Tiptap from "../../components/Tiptap";
import { Sidebar, SidebarButton } from "../../components/Sidebar";
import Button, { ButtonIcon } from "../../components/Button";
import Tooltip, { TooltipIcon } from "../../components/Tooltip";
import Popover, {
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverActions,
} from "../../components/Popover";
import Loader from "../../components/Loader";
import {
  AlertTriangleIcon,
  AlertCircleIcon,
  FolderIcon,
  RocketIcon,
  ShareIcon,
  TrashCanIcon,
  CopyIcon,
  LockIcon,
  XCircleIcon,
} from "../../components/svg/Icons";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import {
  LoadingWrapper,
  WarningIconWrapper,
  ErrorBlock,
} from "../../shared/styles";

function Page() {
  const { user } = useUser();
  const { faunaUserData } = useFaunaUser();

  // Grab pageId from route
  const {
    query: { pageId },
  } = useRouter();

  const [pageFetch, setPageFetch] = useState({
    isLoading: true,
  });
  const [tiptapData, setTiptapData] = useState();
  const [previousTiptapData, setPreviousTiptapData] = useState();
  const [pageSave, setPageSave] = useState({
    isSaving: false,
  });
  const [pageDelete, setPageDelete] = useState({
    isDeleting: false,
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
          .then(async (res) => {
            if (res.status >= 400) {
              let json = await res.json();
              if (json.error) {
                json = json.error;
              }
              setPageFetch({
                error: json,
                isLoading: false,
              });
            } else {
              const json = await res.json();
              setPageFetch({
                response: json,
                isLoading: false,
              });
              setPreviousTiptapData(
                json.success.page.data[0].page.data.contentTiptap
              );
            }
          })
          .catch((error) => {
            console.error(error);
            setPageFetch({
              error: error.message,
              isLoading: false,
            });
          });
      }
    };

    fetchPage();
    // setPageFetch({ isLoading: false });
  }, [pageId]);

  // Check if currently logged in user owns this page
  let userSub;
  let pageOwnerSub;
  let isEditing;

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

  if (userSub === pageOwnerSub) {
    isEditing = true;
  }

  if (pageFetch.isLoading) {
    return (
      <>
        <Head>
          <title>Loading... | pblsh</title>
        </Head>
        <LoadingWrapper>
          <Loader />
        </LoadingWrapper>
      </>
    );
  }

  // Page does not exist or is not editing AND not published, return 404 page
  if (
    !pageFetch.isLoading &&
    (pageFetch.error || (!isEditing && !pageData?.page?.data?.published))
  ) {
    return <Custom404 />;
  }

  let title = "";
  if (pageData && (pageData.page.data.published === true || isEditing)) {
    title = pageData.page.data.title;
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
    const loadingToast = toast.loading("Saving...");
    let values = {};
    values.published = true;
    values.contentTiptap = tiptapData;

    if (pageId) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch(`/api/page/${pageId}/edit`, requestOptions)
        .then(async (res) => {
          if (res.status >= 400) {
            let json = await res.json();
            if (json.error) {
              json = json.error;
            }
            setPageSave({
              error: json,
              isSaving: false,
            });
            toast.dismiss(loadingToast);
            toast.error("Unable to save");
          } else {
            const json = await res.json();
            setPageSave({
              response: json,
              isSaving: false,
              saved: json.success ? true : false,
            });
            setPreviousTiptapData(tiptapData);
            toast.dismiss(loadingToast);
            toast.success("Page saved!");
          }
        })
        .catch((error) => {
          console.error(error);
          setPageSave({
            error: error.message,
            isSaving: false,
          });
          toast.dismiss(loadingToast);
          toast.error(`Unable to save: ${error.message}`);
        });
    }
  };

  // Delete page
  const handlePageDelete = async () => {
    const loadingToast = toast.loading("Deleting page...");
    let values = {};

    if (pageId && isEditing && user && faunaUserData && faunaUserData.id) {
      values.userId = faunaUserData.id;
      values.userSub = user.sub;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch(`/api/page/${pageId}/delete`, requestOptions)
        .then(async (res) => {
          if (res.status >= 400) {
            let json = await res.json();
            if (json.error) {
              json = json.error;
            }
            setPageDelete({
              error: json,
              isDeleting: false,
            });
            toast.dismiss(loadingToast);
            toast.error("Unable to delete");
          } else {
            const json = await res.json();
            setPageDelete({
              response: json,
              isDeleting: false,
              saved: json.success ? true : false,
            });
            toast.dismiss(loadingToast);
            toast.success("Page deleted");
            router.push({ pathname: "/pages", query: { pageDeleted: true } });
          }
        })
        .catch((error) => {
          console.error(error);
          setPageDelete({
            error: error.message,
            isDeleting: false,
          });
          toast.dismiss(loadingToast);
          toast.error(`Unable to delete: ${error.message}`);
        });
    }
  };

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        <Left className={isEditing ? "isEditing" : ""}>
          <h1>{title}</h1>

          {(pageDelete?.error || pageDelete?.response?.error) && (
            <ErrorBlock>
              <WarningIconWrapper>
                <AlertTriangleIcon />
              </WarningIconWrapper>

              <h2>Error Encountered</h2>
              <p>
                {pageDelete?.error?.message ||
                  pageDelete?.response?.error?.message ||
                  "An error was encountered — please try again later"}
              </p>
            </ErrorBlock>
          )}

          {(pageSave?.error || pageSave?.response?.error) && (
            <ErrorBlock>
              <WarningIconWrapper>
                <AlertTriangleIcon />
              </WarningIconWrapper>

              <h2>Error Encountered</h2>
              <p>
                {pageSave?.error?.message ||
                  pageSave?.response?.error?.message ||
                  "An error was encountered — please try again later"}
              </p>
            </ErrorBlock>
          )}

          {!isLoading && pageData && pageData?.page?.data && (
            <Tiptap
              editable={isEditing}
              initialJson={pageData.page.data.contentTiptap || ""}
              sendTiptapData={sendTiptapData}
            />
          )}

          {/* <Tiptap
            editable={true}
            initialHtml="
              <h2>
                Hi there,
              </h2>
              <p>
                this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
              </p>
              <blockquote>
                Wow, that’s amazing. Good work! 👏
                <br />
                — Someone
              </blockquote>
            "
          /> */}
        </Left>

        {isEditing && (
          <Right>
            <Sidebar>
              <Tooltip content="Details" placement="left">
                <Popover>
                  <PopoverTrigger>
                    <AlertCircleIcon />
                  </PopoverTrigger>

                  <PopoverContent
                    theme="secondary"
                    side="left"
                    align="start"
                    sideOffset={9}
                  >
                    <h2>Page Details</h2>
                    <p>
                      {pageData.page.data.published
                        ? "Published"
                        : "Unpublished"}
                    </p>
                    <p>
                      Last Edited:{" "}
                      {timeSinceFromTimestamp(
                        pageData.page.data.updatedAt["@ts"]
                      )}{" "}
                      ago
                    </p>
                    <p>
                      Created:{" "}
                      {timeSinceFromTimestamp(
                        pageData.page.data.createdAt["@ts"]
                      )}{" "}
                      ago
                    </p>
                    <PopoverActions>
                      <PopoverClose
                        as={Button}
                        size="small"
                        color="secondary"
                        onClick={handlePageDelete}
                        disabled={pageDelete.isDeleting}
                      >
                        Close
                        <ButtonIcon>
                          <XCircleIcon />
                        </ButtonIcon>
                      </PopoverClose>
                    </PopoverActions>
                  </PopoverContent>
                </Popover>
              </Tooltip>

              <Tooltip content="Folder" placement="left">
                <Popover>
                  <PopoverTrigger>
                    <FolderIcon />
                  </PopoverTrigger>

                  <PopoverContent
                    theme="secondary"
                    side="left"
                    align="start"
                    sideOffset={9}
                  >
                    <h2>Current Folder</h2>
                    <p>
                      This page is currently saved in your{" "}
                      <Link href={`/folder/${pageData.folder.ref["@ref"].id}`}>
                        {pageData.folder.data.name}
                      </Link>{" "}
                      folder.
                    </p>

                    <PopoverActions>
                      <PopoverClose
                        as={Button}
                        size="small"
                        color="secondary"
                        onClick={handlePageDelete}
                        disabled={pageDelete.isDeleting}
                      >
                        Close
                        <ButtonIcon>
                          <XCircleIcon />
                        </ButtonIcon>
                      </PopoverClose>
                    </PopoverActions>
                  </PopoverContent>
                </Popover>
              </Tooltip>

              <Tooltip
                content={
                  <>
                    {!tiptapData ||
                    isEquivalent(
                      JSON.stringify(tiptapData),
                      JSON.stringify(previousTiptapData)
                    ) ||
                    pageSave.isSaving ? (
                      <>
                        Save changes
                        <TooltipIcon>
                          <LockIcon />
                        </TooltipIcon>
                      </>
                    ) : (
                      <>Save changes</>
                    )}
                  </>
                }
                placement="left"
              >
                <SidebarButton
                  onClick={handlePageSave}
                  disabled={
                    !tiptapData ||
                    isEquivalent(
                      JSON.stringify(tiptapData),
                      JSON.stringify(previousTiptapData)
                    ) ||
                    pageSave.isSaving
                  }
                >
                  <RocketIcon />
                </SidebarButton>
              </Tooltip>

              <Tooltip content="Share" placement="left">
                <Popover>
                  <PopoverTrigger>
                    <ShareIcon />
                  </PopoverTrigger>

                  <PopoverContent
                    theme="secondary"
                    side="left"
                    align="start"
                    sideOffset={9}
                  >
                    <h2>Share Page</h2>
                    {pageData.page.data.published ? (
                      <>
                        <p>
                          You can share this page with others by sending them a
                          link:{" "}
                          <code style={{ userSelect: `all` }}>
                            {`${process.env.NEXT_PUBLIC_BASE_URL}/p/${pageData.page.ref["@ref"].id}`}
                          </code>
                        </p>
                        <PopoverActions>
                          <PopoverClose
                            as={Button}
                            size="small"
                            color="secondary"
                            onClick={() =>
                              copyToClipboard(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/p/${pageData.page.ref["@ref"].id}`
                              )
                            }
                          >
                            Copy
                            <ButtonIcon>
                              <CopyIcon />
                            </ButtonIcon>
                          </PopoverClose>

                          <PopoverClose
                            as={Button}
                            size="small"
                            color="secondary"
                            borderless
                            onClick={handlePageDelete}
                            disabled={pageDelete.isDeleting}
                          >
                            Close
                            <ButtonIcon>
                              <XCircleIcon />
                            </ButtonIcon>
                          </PopoverClose>
                        </PopoverActions>
                      </>
                    ) : (
                      <>
                        <p>
                          In order to share this page, you must first publish
                          it. Click the Edit button to post it!
                        </p>
                        <PopoverActions>
                          <PopoverClose
                            as={Button}
                            size="small"
                            color="secondary"
                            onClick={handlePageDelete}
                            disabled={pageDelete.isDeleting}
                          >
                            Close
                            <ButtonIcon>
                              <XCircleIcon />
                            </ButtonIcon>
                          </PopoverClose>
                        </PopoverActions>
                      </>
                    )}
                  </PopoverContent>
                </Popover>
              </Tooltip>

              <Tooltip
                content={
                  <>
                    {pageDelete.isDeleting ? (
                      <>
                        Delete
                        <TooltipIcon>
                          <LockIcon />
                        </TooltipIcon>
                      </>
                    ) : (
                      <>Delete</>
                    )}
                  </>
                }
                placement="left"
              >
                <Popover>
                  <PopoverTrigger>
                    <TrashCanIcon />
                  </PopoverTrigger>

                  <PopoverContent
                    theme="warning"
                    side="left"
                    align="center"
                    sideOffset={9}
                  >
                    <h2>Are you sure you want to delete this page?</h2>
                    <p>This action is irreversible.</p>

                    <PopoverActions>
                      <PopoverClose
                        as={Button}
                        color="warning"
                        size="small"
                        onClick={handlePageDelete}
                        disabled={pageDelete.isDeleting}
                      >
                        Yes, Delete
                        <ButtonIcon>
                          <TrashCanIcon />
                        </ButtonIcon>
                      </PopoverClose>
                      <PopoverClose as={Button} size="small" borderless>
                        Cancel
                        <ButtonIcon>
                          <XCircleIcon />
                        </ButtonIcon>
                      </PopoverClose>
                    </PopoverActions>
                  </PopoverContent>
                </Popover>
              </Tooltip>
            </Sidebar>
          </Right>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(Page);

const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.35rem;
`;

const Left = styled.main`
  margin: 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  &.isEditing {
    margin: 1.5rem 0 1.5rem 5rem;
  }
`;

const Right = styled.div`
  height: min-content;
  position: sticky;
  top: 2rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
`;

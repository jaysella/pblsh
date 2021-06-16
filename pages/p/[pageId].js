import { useState, useEffect } from "react";

import { useRouter } from "next/router";
import { useUser, isLoading } from "@auth0/nextjs-auth0";
import Head from "next/head";
import toast from "react-hot-toast";
import styled from "@emotion/styled";

import Custom404 from "../404";
import Tiptap from "../../components/Tiptap";
import { Sidebar, SidebarButton } from "../../components/Sidebar";
import Button, { ButtonIcon } from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import Modal, { ModalHeader } from "../../components/Modal";
import Loader from "../../components/Loader";
import {
  AlertTriangleIcon,
  // ArrowRightCircleIcon,
  // CheckCircleIcon,
  AlertCircleIcon,
  FolderIcon,
  RocketIcon,
  ShareIcon,
  TrashCanIcon,
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

  // Grab pageId from route
  const {
    query: { pageId },
  } = useRouter();

  const [pageFetch, setPageFetch] = useState({
    isLoading: true,
  });
  const [tiptapData, setTiptapData] = useState();
  const [pageSave, setPageSave] = useState({
    isSaving: false,
  });

  // MODALS
  const [showShareModal, setShowShareModal] = useState(false);
  const openShareModal = () => setShowShareModal(true);
  const closeShareModal = () => setShowShareModal(false);

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
    (pageFetch.error || (!isEditing && !pageData.page.data.published))
  ) {
    return <Custom404 />;
  }

  let title = "PLACEHOLDER";
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
    const loadingToast = toast.loading("Saving...");
    let values = {};
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
            setPageSave({
              error: await res.json(),
              isSaving: false,
            });
            toast.dismiss(loadingToast);
            toast.error("Unable to save");
          } else {
            setPageSave({
              response: await res.json(),
              isSaving: false,
              saved: res.success ? true : false,
            });
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

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        <Left>
          <h1>{title}</h1>

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

          {!isLoading && pageData && pageData?.page?.data?.contentTiptap && (
            <Tiptap
              editable={isEditing}
              initialJson={pageData.page.data.contentTiptap}
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
              <ul>
                <li>
                  That’s a bullet list with one …
                </li>
                <li>
                  … or two list items.
                </li>
              </ul>
              <p>
                Isn’t that great? And all of that is editable.
              </p>
              <p>
                I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
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
                <SidebarButton disabled>
                  <AlertCircleIcon />
                </SidebarButton>
              </Tooltip>

              <Tooltip content="Folder" placement="left">
                <SidebarButton disabled>
                  <FolderIcon />
                </SidebarButton>
              </Tooltip>

              <Tooltip content="Save changes" placement="left">
                <SidebarButton
                  onClick={handlePageSave}
                  disabled={!tiptapData || pageSave.isSaving}
                >
                  <RocketIcon />
                </SidebarButton>
              </Tooltip>

              <Tooltip content="Share" placement="left">
                <SidebarButton onClick={openShareModal}>
                  <ShareIcon />
                </SidebarButton>
              </Tooltip>

              <Tooltip content="Delete" placement="left">
                <SidebarButton>
                  <TrashCanIcon />
                </SidebarButton>
              </Tooltip>
            </Sidebar>
          </Right>
        )}
      </PageWrapper>

      <Modal isOpen={showShareModal} onDismiss={closeShareModal} label="Share">
        <ModalHeader>
          <h2>Share</h2>
          <p>
            This is not yet implemented{" "}
            <span role="img" aria-label="sad face">
              🙁
            </span>
          </p>
        </ModalHeader>

        <Button onClick={closeShareModal} style={{ marginTop: `2rem` }}>
          Close
          <ButtonIcon>
            <XCircleIcon />
          </ButtonIcon>
        </Button>
      </Modal>
    </>
  );
}

export default withDashboardLayout(Page);

const PageWrapper = styled.div`
  /* margin: 1.5rem 5rem; */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
`;

const Left = styled.main`
  margin: 1.5rem 0 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const Right = styled.div`
  /* margin: 1.5rem 0; */
  height: min-content;
  position: sticky;
  top: 2rem;
`;

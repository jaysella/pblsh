import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import { useFaunaUser } from "../hooks/useFaunaUser";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import Loader from "../components/Loader";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  padStyles,
  LoadingWrapper,
} from "../shared/styles";
import PlusCircleIcon from "../components/svg/PlusCircle";

function Folders() {
  const { user } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [foldersFetched, setFoldersFetched] = useState(false);
  const [foldersData, setFoldersData] = useState();

  useEffect(() => {
    const fetchFolders = async () => {
      if (faunaUserData && faunaUserData.id) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };

        await fetch(`/api/user/${faunaUserData.id}/folders`, requestOptions)
          .then((response) => response.json())
          .then((r) => {
            if (r.success && r.success.folders) {
              const data = r.success.folders.data;
              console.log(data);
              setFoldersData(data);
              setFoldersFetched(true);
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

    fetchFolders();
  }, [faunaUserData]);

  return (
    <>
      <Head>
        <title>Folders | pblsh</title>
      </Head>

      <main>
        <Header>
          <h1>Folders</h1>
        </Header>

        <Content>
          {(faunaUserStatus !== "fetched" || !foldersFetched) && (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Block key={i}>
                  <LoadingWrapper>
                    <Loader />
                  </LoadingWrapper>
                </Block>
              ))}
            </>
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

          {foldersData && foldersData.length < 1 && (
            <Block>
              <h2>No Folders</h2>
              <p>
                You don&apos;t yet have any folders. Let&apos;s fix that by
                creating one now.
              </p>
            </Block>
          )}

          {foldersData &&
            foldersData.map((folder) => (
              <Folder
                href={`/folder/${folder.ref["@ref"].id}`}
                key={folder.ref["@ref"].id}
              >
                <FolderName>{folder.data.name}</FolderName>
              </Folder>
            ))}

          {faunaUserStatus === "fetched" && foldersFetched && (
            <Link href="/new/folder" passHref>
              <CreateNew>
                <PlusCircleIcon />
              </CreateNew>
            </Link>
          )}
        </Content>
      </main>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Folders));

const Header = styled.div`
  padding: 2rem 2.5rem 1rem;

  @media only screen and (min-width: 768px) {
    padding: 2rem 5rem 1rem;
  }
`;

const Content = styled.section`
  margin: 2rem 2.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  grid-gap: 1rem;

  @media only screen and (min-width: 768px) {
    margin: 2rem 5rem;
    grid-template-columns: repeat(6, 1fr);
  }
`;

const sectionTitle = css`
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

const Block = styled.section`
  ${contentBlock};
`;

const ErrorBlock = styled.section`
  ${contentBlock};
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

const Folder = styled.a`
  ${linkStyles};
  ${padWithBackgroundStyles};

  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
`;

const FolderName = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
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

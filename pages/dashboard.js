import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import { useFaunaPages } from "../hooks/useFaunaPages";
import { useFaunaFolders } from "../hooks/useFaunaFolders";
import Head from "next/head";
import Link from "next/link";
import { timeSinceFromTimestamp } from "../helpers/timeSince";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import Button, { ButtonIcon } from "../components/Button";
import Loader from "../components/Loader";
import ClockIcon from "../components/svg/Clock";
import FolderIcon from "../components/svg/Folder";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import PlusCircleIcon from "../components/svg/PlusCircle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  padStyles,
  blink,
  LoadingWrapper,
} from "../shared/styles";

function Dashboard() {
  const { user } = useUser();
  const { faunaUserData } = useFaunaUser();
  const { faunaPagesStatus, faunaPagesData, faunaPagesError } = useFaunaPages();
  const { faunaFoldersStatus, faunaFoldersData, faunaFoldersError } =
    useFaunaFolders();

  const setupCompletedComplete = faunaUserData && faunaUserData.setupCompleted;

  return (
    <>
      <Head>
        <title>Dashboard | pblsh</title>
      </Head>

      <main>
        {faunaPagesData && (
          <>
            {!setupCompletedComplete ? (
              <AccountSetup>
                <h1>Greetings!</h1>
                <p>
                  Welcome to pblsh, we're so happy to have you! Make sure you
                  finish setting up your account as soon as possible.
                </p>

                <br />

                <Button href="/onboarding">
                  Complete Onboarding
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
              </AccountSetup>
            ) : (
              <Welcome>
                <h1>G'day, {faunaUserData.nickname}!</h1>
              </Welcome>
            )}
          </>
        )}

        <Content>
          <Recents>
            <h2>Pick up where you left off</h2>
            <RecentsGrid>
              {faunaPagesStatus !== "fetched" && (
                <>
                  {[0, 1, 2].map((i) => (
                    <Recent key={i}>
                      <LoadingWrapper>
                        <Loader />
                      </LoadingWrapper>
                    </Recent>
                  ))}
                </>
              )}
              {faunaPagesData &&
                faunaPagesData.slice(0, 3).map((p) => (
                  <Link
                    href={`/edit/${p.page.ref["@ref"].id}`}
                    passHref
                    key={p.page.ref["@ref"].id}
                  >
                    <Recent>
                      <RecentName>{p.page.data.title}</RecentName>

                      <RecentMeta>
                        <RecentMetaRow>
                          <ClockIcon />
                          {timeSinceFromTimestamp(
                            p.page.data.updatedAt["@ts"]
                          )}{" "}
                          ago
                        </RecentMetaRow>
                        <RecentMetaRow>
                          <FolderIcon />
                          {p.folder.data.name}
                        </RecentMetaRow>
                      </RecentMeta>
                    </Recent>
                  </Link>
                ))}

              {faunaPagesData && faunaPagesData.length === 0 && (
                <Link href="/new/page" passHref>
                  <Recent>
                    <RecentName>
                      You haven't created any pages yet. Let's fix that.
                    </RecentName>
                  </Recent>
                </Link>
              )}

              <Link href="/new/page" passHref>
                <CreateNewPage>
                  <PlusCircleIcon />
                </CreateNewPage>
              </Link>
            </RecentsGrid>

            {faunaPagesData && faunaPagesData.length > 3 && (
              <Button href="/pages">
                View All
                <ButtonIcon>
                  <ArrowRightCircleIcon />
                </ButtonIcon>
              </Button>
            )}
          </Recents>

          <Folders>
            <h2>Keep Organized</h2>
            <FoldersList>
              {faunaFoldersStatus !== "fetched" && (
                <Block>
                  <LoadingWrapper>
                    <Loader />
                  </LoadingWrapper>
                </Block>
              )}
              {faunaFoldersData &&
                faunaFoldersData.map((folder) => (
                  <Link
                    href={`/folder/${folder.ref["@ref"].id}`}
                    passHref
                    key={folder.ref["@ref"].id}
                  >
                    <Folder>
                      <p>
                        {folder.data.name}
                        {/* <span>
                          {(folder.data.pages && folder.data.pages.length) || 0}{" "}
                          items
                        </span> */}
                      </p>
                    </Folder>
                  </Link>
                ))}
            </FoldersList>

            <Button href="/new/folder">
              New Folder
              <ButtonIcon>
                <PlusCircleIcon />
              </ButtonIcon>
            </Button>
          </Folders>

          {/* <NewPage>
            <h2>Craft Your Next Page</h2>

            <CrafterTemp>The quick brown fox jumped over the moon.</CrafterTemp>
          </NewPage> */}
        </Content>
      </main>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Dashboard));

export const AccountSetup = styled.div`
  margin: 2rem 2.5rem 1rem;
  padding: 2rem;
  background: var(--color-secondary);
  border-radius: var(--base-border-radius);

  @media only screen and (min-width: 768px) {
    margin: 2rem 5rem 1rem;
  }

  p {
    margin-top: 0.75rem;
    font-weight: var(--font-weight-medium);
  }
`;

export const Welcome = styled.div`
  padding: 2rem 2.5rem 1rem;

  @media only screen and (min-width: 768px) {
    padding: 2rem 5rem 1rem;
  }
`;

export const Content = styled.div`
  margin: 2rem 2.5rem;
  display: grid;
  grid-template-columns: 100%;
  grid-template-areas: "recents" "folders" "newPage";
  grid-gap: 2rem;

  @media only screen and (min-width: 768px) {
    margin: 2rem 5rem;
    grid-template-columns: 3fr 1fr;
    /* grid-auto-rows: auto; */
    grid-template-areas: "recents folders" "newPage .";
  }
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

export const Recents = styled.section`
  ${contentBlock};
  grid-area: recents;
`;

export const RecentsGrid = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media only screen and (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const Recent = styled.a`
  ${linkStyles};
  ${padWithBackgroundStyles};

  display: grid;
  grid-template-rows: 1fr auto;
  padding: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
`;

export const RecentName = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
`;

export const RecentMeta = styled.div`
  margin-top: 1rem;
  font-size: 0.75em;
  font-weight: var(--font-weight-light);
  align-content: end;
`;

export const RecentMetaRow = styled.div`
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

export const RecentActions = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-gap: 1rem;
`;

export const RecentAction = styled.a`
  ${linkStyles};
  ${padWithBackgroundStyles};

  padding: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
`;

const CreateNewPage = styled.a`
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

export const Folders = styled.section`
  ${contentBlock};
  grid-area: folders;
`;

export const FoldersList = styled.div`
  margin-bottom: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
  background: var(--color-black-muted);
`;

export const Folder = styled.a`
  ${linkStyles};
  ${padStyles};

  display: block;
  padding: 0.7rem 1rem;

  &:first-of-type {
    border-radius: var(--base-border-radius) var(--base-border-radius) 0 0;
  }

  &:not(:hover):not(:focus):not(:last-of-type) {
    box-shadow: 0 calc(var(--base-border-width) / 2) 0 var(--color-black);
  }

  &:last-of-type {
    border-radius: 0 0 var(--base-border-radius) var(--base-border-radius);
  }

  &:only-of-type {
    border-radius: calc(var(--base-border-radius) / 1.75);
  }

  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  span {
    font-size: 0.75em;
    font-weight: var(--font-weight-light);
    text-align: right;
  }
`;

export const NewPage = styled.section`
  ${contentBlock};
  grid-area: newPage;
`;

export const CrafterTemp = styled.section`
  font-size: 1.4em;
  line-height: 1.2;
  text-align: left;
  position: relative;

  &:after {
    content: "";
    top: -5px;
    left: 0;
    margin-left: 0.3rem;
    height: 25px;
    border: 1px solid var(--color-white-muted);
    animation: ${blink} 0.5s infinite ease-in-out alternate;
  }
`;

export const Block = styled.div`
  ${contentBlock};
`;

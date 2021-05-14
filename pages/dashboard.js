import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import Button, { ButtonIcon } from "../components/Button";
import PlusCircleIcon from "../components/svg/PlusCircle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  padStyles,
  blink,
} from "../shared/styles";

function Dashboard() {
  const { user } = useUser();
  const setupCompletedComplete = false;

  return (
    <>
      <Head>
        <title>Dashboard | pblsh</title>
      </Head>

      <main>
        {!setupCompletedComplete ? (
          <AccountSetup>
            <h1>Greetings!</h1>
            <p>Welcome to pblsh, we're so happy to have you!</p>
          </AccountSetup>
        ) : (
          <Welcome>
            <h1>Hey, {user?.name}!</h1>
          </Welcome>
        )}

        <Content>
          <Recents>
            <h2>Pick up where you left off</h2>
            <RecentsGrid>
              <Link href="/pages" passHref>
                <Recent>
                  <RecentName>8/20 Concert Signup Info</RecentName>

                  <RecentMeta>
                    <RecentMetaRow>
                      <Image
                        src="/icons/clock.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      an hour ago
                    </RecentMetaRow>
                    <RecentMetaRow>
                      <Image
                        src="/icons/folder.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      Concerts
                    </RecentMetaRow>
                  </RecentMeta>
                </Recent>
              </Link>

              <Link href="/pages" passHref>
                <Recent>
                  <RecentName>Planning Meeting Notes: 4/19</RecentName>

                  <RecentMeta>
                    <RecentMetaRow>
                      <Image
                        src="/icons/clock.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      3 hours ago
                    </RecentMetaRow>
                    <RecentMetaRow>
                      <Image
                        src="/icons/folder.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      Uncategorized
                    </RecentMetaRow>
                  </RecentMeta>
                </Recent>
              </Link>

              <Link href="/pages" passHref>
                <Recent>
                  <RecentName>Guide: How to Update Your Password</RecentName>

                  <RecentMeta>
                    <RecentMetaRow>
                      <Image
                        src="/icons/clock.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      2 days ago
                    </RecentMetaRow>
                    <RecentMetaRow>
                      <Image
                        src="/icons/folder.svg"
                        alt="User profile"
                        width={14}
                        height={14}
                      />
                      Guides
                    </RecentMetaRow>
                  </RecentMeta>
                </Recent>
              </Link>

              <RecentActions>
                <Link href="/pages" passHref>
                  <RecentAction>
                    <RecentActionName>
                      <span>8</span> more recents
                    </RecentActionName>
                  </RecentAction>
                </Link>

                <Link href="/pages" passHref>
                  <RecentAction>
                    <RecentActionName>View all</RecentActionName>
                  </RecentAction>
                </Link>
              </RecentActions>
            </RecentsGrid>
          </Recents>

          <Folders>
            <h2>Keep Organized</h2>
            <FoldersList>
              <Link href="/folders" passHref>
                <Folder>
                  <p>
                    Concerts
                    <span>3 items</span>
                  </p>
                </Folder>
              </Link>
              <Link href="/folders" passHref>
                <Folder>
                  <p>
                    Guides<span>1 item</span>
                  </p>
                </Folder>
              </Link>
              <Link href="/folders" passHref>
                <Folder>
                  <p>
                    Uncategorized<span>8 items</span>
                  </p>
                </Folder>
              </Link>
            </FoldersList>

            <Button>
              Create New
              <ButtonIcon>
                <PlusCircleIcon />
              </ButtonIcon>
            </Button>
          </Folders>

          <NewPage>
            <h2>Craft Your Next Page</h2>

            <CrafterTemp>The quick brown fox jumped over the moon.</CrafterTemp>
          </NewPage>
        </Content>
      </main>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Dashboard));

export const AccountSetup = styled.div`
  margin: 2rem 5rem 1rem;
  padding: 2rem;
  background: var(--color-secondary);
  border-radius: var(--base-border-radius);

  p {
    margin-top: 0.75rem;
    font-weight: var(--font-weight-medium);
  }
`;

export const Welcome = styled.div`
  padding: 2rem 5rem 1rem;
`;

export const Content = styled.div`
  margin: 2rem 5rem;
  display: grid;
  grid-template-columns: 3fr 1fr;
  /* grid-auto-rows: auto; */
  grid-template-areas: "recents folders" "newPage .";
  grid-gap: 2rem;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
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

export const RecentActionName = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
  text-align: left;

  span {
    color: var(--color-primary);
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

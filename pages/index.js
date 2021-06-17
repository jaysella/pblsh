import { useUser } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Router from "next/router";
import Head from "next/head";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import Button, { ButtonIcon } from "../components/Button";
import { ArrowRightCircleIcon } from "../components/Icons";
import Loader from "../components/Loader";
import { LoadingWrapper } from "../shared/styles";
import styled from "@emotion/styled";

function LandingPage() {
  const { user, error, isLoading } = useUser();
  const { faunaUserStatus, faunaUserData } = useFaunaUser();

  if (user && faunaUserData) {
    if (faunaUserData.setupCompleted) {
      Router.push(`/dashboard`);
      return (
        <>
          <Head>Redirecting ...</Head>
          <PageWrapper>
            <LoadingWrapper>
              <Loader />
            </LoadingWrapper>
          </PageWrapper>
        </>
      );
    } else {
      Router.push(`/onboarding`);
      return (
        <>
          <Head>Redirecting ...</Head>
          <PageWrapper>
            <LoadingWrapper>
              <Loader />
            </LoadingWrapper>
          </PageWrapper>
        </>
      );
    }
  }

  return (
    <>
      <Head>
        <title>Welcome to pblsh!</title>
        {/* <meta name="description" content="A new way to publish" /> */}
      </Head>

      <PageWrapper>
        {(isLoading ||
          (faunaUserStatus !== "fetched" && faunaUserStatus !== "no_user")) && (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        )}

        {error && <div>{error.message}</div>}

        {!isLoading && !error && faunaUserStatus === "no_user" && (
          <HeroSection>
            <Left>
              <h1>
                Because <span>sharing</span> is caring.
              </h1>
              <p>
                Welcome to pblsh&mdash;a simple, easy, quick solution for
                organizing and sharing notes + thoughts.
              </p>

              <Actions>
                <Button href="/api/auth/login">
                  Start Sharing
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
              </Actions>
            </Left>
          </HeroSection>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(LandingPage);

const PageWrapper = styled.main`
  margin: 2.5rem 0;
  min-height: 50vh;

  @media only screen and (min-width: 768px) {
    margin: 5rem 0;
  }
`;

const HeroSection = styled.section`
  margin: 0 2.5rem;

  @media only screen and (min-width: 768px) {
    margin: 0 5rem;
  }

  h1 {
    font-size: 3.5rem;
    line-height: 1.2;

    span {
      background-color: var(--color-primary);
      padding: 0.5rem;
      border-radius: var(--base-border-radius);
      color: var(--color-black);
    }
  }

  p {
    margin-top: 1.25rem;
    font-size: 1.2em;
    font-weight: var(--font-weight-light);
    line-height: 1.55;
  }
`;

const Left = styled.div`
  max-width: 500px;
`;

const Actions = styled.div`
  margin-top: 3rem;
`;

import { useState, useEffect } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Router from "next/router";
import Head from "next/head";
import { withSimpleLayout } from "../components/layout/SimpleLayout";
import Button, { ButtonIcon } from "../components/Button";
import LogoColored from "../components/svg/LogoColored";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
} from "../components/Form";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Formik } from "formik";
import * as Yup from "yup";

import Loader from "../components/Loader";
import CheckmarkCircle from "../components/CheckmarkCircle";

const onboardingSchema = Yup.object().shape({
  // username: Yup.string()
  //   .min(3, "Too short! Usernames must have at least 3 characters")
  //   .max(50, "Too long! Usernames must have 50 characters or less")
  //   .required("Required")
  //   .lowercase()
  //   .trim(),
  name: Yup.string()
    .min(2, "Too short! Please enter at least 2 characters")
    .max(50, "Too long! Please truncate your name to 50 characters")
    .required("Required"),
});

function Onboarding() {
  const { user, error, isLoading } = useUser();

  const [fetchingFaunaUser, setFetchingFaunaUser] = useState(true);
  const [faunaUser, setFaunaUser] = useState();
  const [faunaError, setFaunaError] = useState(false);

  useEffect(async () => {
    if (user && user.email) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      };

      await fetch("/api/user/lookup", requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.error) {
            if (r.error.name !== "no_user") {
              console.log("Error:", r.error);
              const errorMessage =
                r.error.name === "database_error"
                  ? "An error was encountered — please try again later"
                  : r.error.message;
              setFaunaError(errorMessage);
            }
          } else {
            if (localStorage.getItem("user")) {
              localStorage.removeItem("user");
            }

            const data = r.success.user.data;
            data.id = r.success.user.ref["@ref"].id;

            localStorage.setItem("user", JSON.stringify(data));
            setFaunaUser(data);
          }

          setFetchingFaunaUser(false);
        })
        .catch((error) => {
          console.error(error);
          setFaunaError(error.message);
        });
    }
  }, [user]);

  const setupCompleted = faunaUser && faunaUser.setupCompleted;

  const [accountCreated, setAccountCreated] = useState(false);

  async function handleSubmit(values) {
    if (user) {
      values.auth0Id = user?.sub;
      values.email = user?.email;
      values.nickname = user?.nickname;
      values.setupCompleted = true;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch("/api/user/new", requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.error) {
            console.log("Error:", r.error);
            const errorMessage =
              r.error.name === "database_error"
                ? "An error was encountered — please try again later"
                : r.error.message;
            setFaunaError(errorMessage);
          } else {
            console.log(r);
            setAccountCreated(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setFaunaError(error.message);
        });
    }
  }

  if (setupCompleted) {
    Router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Onboarding | pblsh</title>
      </Head>

      <PageWrapper>
        <LogoBox>
          <LogoColored />
        </LogoBox>

        {error && (
          <Block>
            <h2>Error</h2>
            <p>{error.message}</p>
          </Block>
        )}

        {faunaError && (
          <Block>
            <h2>Error</h2>
            <p>{faunaError}</p>
          </Block>
        )}

        {!isLoading &&
          fetchingFaunaUser !== "fetched" &&
          !error &&
          !faunaError && (
            <>
              {!setupCompleted ? (
                <>
                  {!accountCreated ? (
                    <>
                      <AccountSetup>
                        <h1>Greetings!</h1>
                        <p>Welcome to pblsh, we're so happy to have you!</p>
                      </AccountSetup>
                      <Block>
                        <h2>Finalize Your Account</h2>
                        <p>
                          Before we dive in, we just need a few more pieces of
                          information.
                        </p>

                        <FormSection>
                          <Formik
                            initialValues={{
                              email: user?.email,
                              // username: user?.nickname,
                              name: user?.nickname,
                            }}
                            validationSchema={onboardingSchema}
                            onSubmit={(values) => handleSubmit(values)}
                          >
                            {({ errors, touched, isSubmitting }) => (
                              <FormWrapper>
                                <InputGroup>
                                  <InputLabel htmlFor="email">Email</InputLabel>
                                  <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    disabled
                                  />
                                </InputGroup>

                                {/* <InputGroup>
                              <InputLabel htmlFor="username">Username</InputLabel>
                              <Input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="jschmoe"
                                disabled={isSubmitting}
                                invalid={errors.username && touched.username}
                              />
                              {errors.username && touched.username && (
                                <InputError animated={true}>{errors.username}</InputError>
                              )}
                            </InputGroup> */}

                                <InputGroup>
                                  <InputLabel htmlFor="name">Name</InputLabel>
                                  <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Jim Schmoe"
                                    disabled={isSubmitting}
                                    invalid={
                                      errors.name && touched.name
                                        ? "invalid"
                                        : null
                                    }
                                  />
                                  {errors.name && touched.name && (
                                    <InputError animated={true}>
                                      {errors.name}
                                    </InputError>
                                  )}
                                </InputGroup>

                                <InputGroup>
                                  {isSubmitting ? (
                                    <Button
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Processing
                                      <ButtonIcon>
                                        <Loader />
                                      </ButtonIcon>
                                    </Button>
                                  ) : (
                                    <Button
                                      type="submit"
                                      disabled={isSubmitting}
                                    >
                                      Save &amp; Continue
                                      <ButtonIcon>
                                        <ArrowRightCircleIcon />
                                      </ButtonIcon>
                                    </Button>
                                  )}
                                </InputGroup>
                              </FormWrapper>
                            )}
                          </Formik>
                        </FormSection>
                      </Block>
                    </>
                  ) : (
                    <>
                      <Block>
                        <CheckmarkWrapper>
                          <CheckmarkCircle />
                        </CheckmarkWrapper>

                        <h2>All Set!</h2>
                        <p>Your account is set up and ready to use.</p>
                      </Block>

                      <Button href="/dashboard">
                        Jump In
                        <ButtonIcon>
                          <ArrowRightCircleIcon />
                        </ButtonIcon>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Block>
                    <h2>Already Onboard</h2>
                    <p>
                      If you are not automatically redirected, please click the
                      button below.
                    </p>
                  </Block>

                  <Button href="/dashboard">
                    Dashboard
                    <ButtonIcon>
                      <ArrowRightCircleIcon />
                    </ButtonIcon>
                  </Button>
                </>
              )}
            </>
          )}
      </PageWrapper>
    </>
  );
}

export default withSimpleLayout(withPageAuthRequired(Onboarding));

export const PageWrapper = styled.main`
  margin: 5rem auto 3rem;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LogoBox = styled.div`
  padding: 2rem 0;

  svg {
    width: 25%;
    height: auto;
  }
`;

export const AccountSetup = styled.div`
  padding: 2rem;
  background: var(--color-secondary);
  border-radius: var(--base-border-radius);
  color: var(--color-black);

  p {
    margin-top: 0.75rem;
    font-weight: var(--font-weight-medium);
  }
`;

export const Welcome = styled.div`
  padding: 2rem 5rem 1rem;
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

export const Block = styled.section`
  ${contentBlock};
`;

export const FormSection = styled.div`
  margin-top: 2.5rem;
`;

export const CheckmarkWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

import { useState } from "react";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Head from "next/head";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
  InputInfo,
} from "../components/Form";
import Button, { ButtonIcon } from "../components/Button";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import CheckCircleIcon from "../components/svg/CheckCircle";
import Loader from "../components/Loader";
import CheckmarkCircle from "../components/CheckmarkCircle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Formik } from "formik";
import * as Yup from "yup";
import AlertTriangleIcon from "../components/svg/AlertTriangle";

const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too short! Please enter at least 2 characters")
    .max(50, "Too long! Please truncate your name to 50 characters")
    .trim()
    .required("Required"),
  nickname: Yup.string()
    .min(2, "Too short! Please enter at least 2 characters")
    .max(20, "Too long! Please limit your nickname to 20 characters or less")
    .trim(),
});

function Profile() {
  const { user, error, isLoading } = useUser();
  const [accountEdited, setAccountEdited] = useState(false);
  const { faunaUserStatus, faunaUserData } = useFaunaUser();
  const [faunaError, setFaunaError] = useState(false);

  async function handleSubmit(values) {
    if (user && faunaUserData) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch(`/api/user/${faunaUserData.id}/edit`, requestOptions)
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
            if (localStorage.getItem("user")) {
              localStorage.removeItem("user");
            }
            setAccountEdited(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setFaunaError(error.message);
        });
    }
  }

  return (
    <>
      <Head>
        <title>Profile | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Your Profile</h1>

        {!isLoading && !error && user && faunaUserStatus === "fetched" && (
          <>
            {accountEdited && (
              <Block>
                <CheckmarkWrapper>
                  <CheckmarkCircle />
                </CheckmarkWrapper>

                <h2>All Set!</h2>
                <p>Your account has been successfully updated.</p>
              </Block>
            )}

            <Block>
              <h2>Update Your Account</h2>
              <p>Let's keep your info up-to-date.</p>

              <FormSection>
                <Formik
                  initialValues={{
                    email: user?.email,
                    name: faunaUserData?.name,
                    nickname: faunaUserData?.nickname,
                  }}
                  validationSchema={profileSchema}
                  onSubmit={(values) => handleSubmit(values)}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <FormWrapper>
                      {faunaError && (
                        <ErrorBlock>
                          <WarningIconWrapper>
                            <AlertTriangleIcon />
                          </WarningIconWrapper>

                          <h2>Error Encountered</h2>
                          <p>
                            {faunaError ||
                              "An error was encountered — please try again later"}
                          </p>
                        </ErrorBlock>
                      )}

                      <InputGroup>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input type="text" id="email" name="email" disabled />
                        <InputInfo animated={false}>
                          To change your email, please contact us
                        </InputInfo>
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
                            errors.name && touched.name ? "invalid" : null
                          }
                        />
                        {errors.name && touched.name && (
                          <InputError animated={true}>{errors.name}</InputError>
                        )}
                      </InputGroup>

                      <InputGroup>
                        <InputLabel htmlFor="name">Nickname</InputLabel>
                        <Input
                          type="text"
                          id="nickname"
                          name="nickname"
                          placeholder="Jimmy"
                          disabled={isSubmitting}
                          invalid={
                            errors.nickname && touched.nickname
                              ? "invalid"
                              : null
                          }
                        />
                        {errors.nickname && touched.nickname && (
                          <InputError animated={true}>
                            {errors.nickname}
                          </InputError>
                        )}
                      </InputGroup>

                      <InputGroup>
                        <Button type="submit" disabled={isSubmitting}>
                          Save Changes
                          <ButtonIcon>
                            {isSubmitting ? (
                              <Loader />
                            ) : accountEdited ? (
                              <CheckCircleIcon />
                            ) : (
                              <ArrowRightCircleIcon />
                            )}
                          </ButtonIcon>
                        </Button>
                      </InputGroup>
                    </FormWrapper>
                  )}
                </Formik>
              </FormSection>
            </Block>

            <Block>
              {user.email_verified ? (
                <SuccessIconWrapper>
                  <CheckCircleIcon />
                </SuccessIconWrapper>
              ) : (
                <WarningIconWrapper>
                  <AlertTriangleIcon />
                </WarningIconWrapper>
              )}

              <h2>Email Verification</h2>

              {user.email_verified ? (
                <p>Your email address has been successfully verified.</p>
              ) : (
                <>
                  <p>
                    Please verify your email address. A link was sent when you
                    created your account.
                  </p>
                  <p>
                    Make sure to check your junk/spam folder if you don't see
                    it.
                  </p>
                </>
              )}
            </Block>
          </>
        )}

        {isLoading && (
          <Block>
            <h2>Loading Profile</h2>
            <p>Please wait...</p>
          </Block>
        )}

        {error && (
          <ErrorBlock>
            <WarningIconWrapper>
              <AlertTriangleIcon />
            </WarningIconWrapper>

            <h2>Error Encountered</h2>
            <p>
              Please try again later, and if the issue persists, please contact
              us.
            </p>
            <pre>{error?.message}</pre>
          </ErrorBlock>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(Profile));

export const PageWrapper = styled.main`
  margin: 3rem auto;
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

const blockStyles = css`
  ${contentBlock};

  p:not(:first-of-type) {
    margin-top: 0.75rem;
  }
`;

export const Block = styled.section`
  ${blockStyles};
`;

export const ErrorBlock = styled.section`
  ${blockStyles};
  border-color: var(--color-tertiary);
`;

export const FormSection = styled.div`
  margin-top: 2.5rem;
`;

export const CheckmarkWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const WarningIconWrapper = styled.div`
  margin-bottom: 1.25rem;
  color: var(--color-tertiary);

  svg {
    width: 2.5rem;
    height: auto;
  }
`;

export const SuccessIconWrapper = styled.div`
  margin-bottom: 1.25rem;
  color: var(--color-primary);

  svg {
    width: 2.5rem;
    height: auto;
  }
`;

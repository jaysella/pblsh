import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useFaunaUser } from "../../hooks/useFaunaUser";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
  ActionGroup,
} from "../Form";
import Button, { ButtonIcon } from "../Button";
import { ArrowRightCircleIcon, XCircleIcon, AlertTriangleIcon } from "../Icons";
import CheckmarkCircle from "../CheckmarkCircle";
import Loader from "../Loader";
import Modal, { ModalHeader } from "../Modal";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const abuseReportSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too short! Please enter at least 2 characters")
    .max(50, "Too long! Please truncate your name to 50 characters")
    .required("Required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Required"),
  url: Yup.string().url("Please enter a valid URL").required("Required"),
  description: Yup.string()
    .max(500, "Please limit your description to 500 characters or less")
    .trim()
    .required("Required"),
});

export default function Layout() {
  const { user, isLoading } = useUser();
  const { faunaUserData } = useFaunaUser();

  const [faunaError, setFaunaError] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const open = () => setShowModal(true);
  const close = () => setShowModal(false);

  async function handleSubmit(values) {
    values.type = "abuse";

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    await fetch("/api/report/new", requestOptions)
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
          setReportSubmitted(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setFaunaError(error.message);
      });
  }

  return (
    <>
      {!isLoading && (
        <>
          {user ? (
            <FooterWrapper>
              <Text>
                <span>
                  A{" "}
                  <Link href="https://www.jaysella.dev?src=pblsh" passHref>
                    <a target="_blank" rel="noopener">
                      Jay Sella
                    </a>
                  </Link>{" "}
                  Project
                </span>
                <span>
                  <button onClick={open}>Report Abuse</button>
                </span>
              </Text>

              <Modal isOpen={showModal} onDismiss={close} label="Report Abuse">
                <ModalHeader>
                  <h2>Report Abuse</h2>
                  <p>
                    Do you think the content on this page violates our rules?
                    Please let us know by reporting it below.
                  </p>
                </ModalHeader>

                {reportSubmitted ? (
                  <Block>
                    <CheckmarkWrapper>
                      <CheckmarkCircle />
                    </CheckmarkWrapper>

                    <h3>Report Submitted</h3>
                    <p>
                      Your abuse report has been successfully submitted. We may
                      follow up with you if we have any questions.
                    </p>

                    <Button onClick={close} style={{ marginTop: `2rem` }}>
                      Close
                      <ButtonIcon>
                        <XCircleIcon />
                      </ButtonIcon>
                    </Button>
                  </Block>
                ) : (
                  <Formik
                    initialValues={{
                      name: faunaUserData?.name || "",
                      email: faunaUserData?.email || "",
                      url:
                        (typeof window !== "undefined"
                          ? window.location.href
                          : "") || "",
                      description: "",
                    }}
                    validationSchema={abuseReportSchema}
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
                          <InputLabel htmlFor="name">Your Name</InputLabel>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Schmoe"
                            disabled={isSubmitting}
                            invalid={
                              errors.name && touched.name ? "invalid" : null
                            }
                          />
                          {errors.name && touched.name && (
                            <InputError animated={true}>
                              {errors.name}
                            </InputError>
                          )}
                        </InputGroup>

                        <InputGroup>
                          <InputLabel htmlFor="email">Your Email</InputLabel>
                          <Input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="j.shmoe@example.com"
                            disabled={isSubmitting}
                            invalid={
                              errors.email && touched.email ? "invalid" : null
                            }
                          />
                          {errors.email && touched.email && (
                            <InputError animated={true}>
                              {errors.email}
                            </InputError>
                          )}
                        </InputGroup>

                        <InputGroup>
                          <InputLabel htmlFor="url">URL to Report</InputLabel>
                          <Input
                            type="url"
                            id="url"
                            name="url"
                            placeholder="https://pblsh.page/abusive-page"
                            disabled={
                              isSubmitting ||
                              (typeof window !== "undefined" &&
                                window.location.href)
                            }
                            invalid={
                              errors.url && touched.url ? "invalid" : null
                            }
                          />
                          {errors.url && touched.url && (
                            <InputError animated={true}>
                              {errors.url}
                            </InputError>
                          )}
                        </InputGroup>

                        <InputGroup>
                          <InputLabel htmlFor="description">
                            Description
                          </InputLabel>
                          <Input
                            as="textarea"
                            id="description"
                            name="description"
                            placeholder="A brief explanation of why you believe this should be removed"
                            rows="4"
                            disabled={isSubmitting}
                            invalid={
                              errors.description && touched.description
                                ? "invalid"
                                : null
                            }
                          />
                          {errors.description && touched.description && (
                            <InputError animated={true}>
                              {errors.description}
                            </InputError>
                          )}
                        </InputGroup>

                        <ActionGroup>
                          <Button type="submit" disabled={isSubmitting}>
                            Submit Report
                            <ButtonIcon>
                              {isSubmitting || reportSubmitted ? (
                                <Loader />
                              ) : (
                                <ArrowRightCircleIcon />
                              )}
                            </ButtonIcon>
                          </Button>

                          <Button
                            disabled={isSubmitting}
                            onClick={close}
                            borderless
                          >
                            Close
                            <ButtonIcon>
                              <XCircleIcon />
                            </ButtonIcon>
                          </Button>
                        </ActionGroup>
                      </FormWrapper>
                    )}
                  </Formik>
                )}
              </Modal>
            </FooterWrapper>
          ) : (
            <FooterWrapper>
              <Text>
                <span>&copy; {new Date().getFullYear()} pblsh</span>
                <span>All Rights Reserved</span>
                <span>
                  A{" "}
                  <Link href="https://www.jaysella.dev?src=pblsh" passHref>
                    <a target="_blank" rel="noopener">
                      Jay Sella
                    </a>
                  </Link>{" "}
                  Project
                </span>
              </Text>
            </FooterWrapper>
          )}
        </>
      )}
    </>
  );
}

const FooterWrapper = styled.footer`
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media only screen and (min-width: 768px) {
    padding: 2rem 5rem;
  }
`;

const Text = styled.p`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-white-muted);

  a,
  button {
    color: inherit;
    font-size: 0.8rem;
    font-weight: var(--font-weight-medium);
    text-decoration: underline;
    transition: color var(--base-transition-out-duration) ease-out;

    &:hover {
      color: var(--color-white);
      transition: color var(--base-transition-in-duration) ease-in;
    }

    &:focus {
      outline: var(--base-border-width) solid var(--color-highlight);
    }
  }
`;

const CheckmarkWrapper = styled.div`
  margin-bottom: 1.5rem;
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

  h2,
  h3 {
    ${sectionTitle};
  }
`;

const blockStyles = css`
  ${contentBlock};

  p:not(:first-of-type) {
    margin-top: 0.75rem;
  }
`;

const Block = styled.section`
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

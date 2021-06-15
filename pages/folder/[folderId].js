import { useState, useEffect } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import Loader from "../../components/Loader";
import ClockIcon from "../../components/svg/Clock";
import AlertTriangleIcon from "../../components/svg/AlertTriangle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  LoadingWrapper,
} from "../../shared/styles";

import { timeSinceFromTimestamp } from "../../helpers/timeSince";

import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
} from "../../components/Form";
import Button, { ButtonIcon } from "../../components/Button";
import ArrowLeftCircleIcon from "../../components/svg/ArrowLeftCircle";
import ArrowRightCircleIcon from "../../components/svg/ArrowRightCircle";
// import CheckCircleIcon from "../../components/svg/CheckCircle";
// import CheckmarkCircle from "../../components/CheckmarkCircle";
import { Formik } from "formik";
import * as Yup from "yup";

const pageSchema = Yup.object().shape({
  publicLink: Yup.string().trim().required("Required"),
});

function ViewFolder() {
  const router = useRouter();
  const { folderId } = router.query;
  const [faunaFetchingError, setFaunaFetchingError] = useState(false);

  const [folderFetched, setFolderFetched] = useState(false);
  const [folderData, setFolderData] = useState();

  const [folderPagesFetched, setFolderPagesFetched] = useState(false);
  const [folderPagesData, setFolderPagesData] = useState();

  const [faunaEditingError, setFaunaEditingError] = useState(false);
  const [folderEdited, setFolderEdited] = useState(false);

  useEffect(() => {
    const fetchFolder = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/folder/${folderId}`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.folder) {
            const data = r.success.folder;
            setFolderData(data);
            setFolderFetched(true);
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
    };

    const fetchPages = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/folder/${folderId}/pages`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.pages) {
            const data = r.success.pages;
            setFolderPagesData(data);
            setFolderPagesFetched(true);
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
    };

    async function fetchData() {
      await fetchFolder();
      await fetchPages();
    }

    fetchData();
  }, [folderId]);

  let title;
  if (folderFetched) {
    title = folderData.data.name;
  } else if (faunaFetchingError) {
    title = "Error";
  } else {
    title = "Loading...";
  }

  // async function handleSubmit(values) {
  //   if (pageId) {
  //     values.published = true;

  //     const requestOptions = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(values),
  //     };

  //     await fetch(`/api/page/${pageId}/edit`, requestOptions)
  //       .then((response) => response.json())
  //       .then((r) => {
  //         if (r.error) {
  //           console.log("Error:", r.error);
  //           const errorMessage =
  //             r.error.name === "database_error"
  //               ? "An error was encountered — please try again later"
  //               : r.error.message;
  //           setFaunaEditingError(errorMessage);
  //         } else {
  //           console.log(r);
  //           setFolderEdited(true);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setFaunaEditingError(error.message);
  //       });
  //   }
  // }

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        <Button href="/folders">
          <ButtonIcon>
            <ArrowLeftCircleIcon />
          </ButtonIcon>
          Back to Folders
        </Button>

        {folderFetched && <h1>{title}</h1>}

        {(!folderFetched || !folderPagesFetched) && (
          <RecentsGrid>
            {[0, 1, 2, 3].map((i) => (
              <Block key={i}>
                <LoadingWrapper>
                  <Loader />
                </LoadingWrapper>
              </Block>
            ))}
          </RecentsGrid>
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

        {folderPagesData &&
          folderPagesData.data &&
          folderPagesData.data.length < 1 && (
            <Block>
              <h2>No Pages</h2>
              <p>
                It&apos;s lonely in here. No pages have been added to this
                folder.
              </p>
            </Block>
          )}

        {folderPagesFetched && (
          <>
            {/* {folderEdited && (
              <Block>
                <CheckmarkWrapper>
                  <CheckmarkCircle />
                </CheckmarkWrapper>

                <h2>All Set!</h2>
                <p>Your changes have been saved successfully.</p>
              </Block>
            )} */}

            <RecentsGrid>
              {folderPagesData &&
                folderPagesData.data &&
                folderPagesData.data.map((page) => (
                  <Link
                    href={`/edit/${page.ref["@ref"].id}`}
                    passHref
                    key={page.ref["@ref"].id}
                  >
                    <Recent>
                      <RecentName>{page.data.title}</RecentName>

                      <RecentMeta>
                        <RecentMetaRow>
                          <ClockIcon />
                          {timeSinceFromTimestamp(
                            page.data.updatedAt["@ts"]
                          )}{" "}
                          ago
                        </RecentMetaRow>
                      </RecentMeta>
                    </Recent>
                  </Link>
                ))}
            </RecentsGrid>

            <Formik
              initialValues={{
                name: folderData.data.name || "",
              }}
              validationSchema={pageSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, touched, isSubmitting }) => (
                <FormWrapper hidden>
                  {faunaEditingError && (
                    <ErrorBlock>
                      <WarningIconWrapper>
                        <AlertTriangleIcon />
                      </WarningIconWrapper>

                      <h2>Error Encountered</h2>
                      <p>
                        {faunaEditingError ||
                          "An error was encountered — please try again later"}
                      </p>
                    </ErrorBlock>
                  )}

                  <InputGroup>
                    <InputLabel htmlFor="name">Folder Name</InputLabel>
                    <Input
                      id="name"
                      name="name"
                      placeholder="My Awesome Folder"
                      disabled={isSubmitting}
                      invalid={errors.name && touched.name ? "invalid" : null}
                    />
                    {errors.name && touched.name && (
                      <InputError animated={true}>{errors.name}</InputError>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <Button type="submit" disabled={isSubmitting}>
                      Save
                      <ButtonIcon>
                        {isSubmitting ? <Loader /> : <ArrowRightCircleIcon />}
                      </ButtonIcon>
                      {/* <ButtonIcon>
                        {isSubmitting ? (
                          <Loader />
                        ) : folderEdited ? (
                          <CheckCircleIcon />
                        ) : (
                          <ArrowRightCircleIcon />
                        )}
                      </ButtonIcon> */}
                    </Button>
                  </InputGroup>
                </FormWrapper>
              )}
            </Formik>
          </>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(ViewFolder));

const PageWrapper = styled.main`
  margin: 2rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

const RecentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
`;

const Recent = styled.a`
  ${linkStyles};
  ${padWithBackgroundStyles};

  display: grid;
  grid-template-rows: 1fr auto;
  padding: 1rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
`;

const RecentName = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
`;

const RecentMeta = styled.div`
  margin-top: 1rem;
  font-size: 0.75em;
  font-weight: var(--font-weight-light);
  align-content: end;
`;

const RecentMetaRow = styled.div`
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

const CheckmarkWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

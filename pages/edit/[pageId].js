import { useState, useEffect, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Head from "next/head";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
// import ContentEditable from "react-contenteditable";
import Loader from "../../components/Loader";
import AlertTriangleIcon from "../../components/svg/AlertTriangle";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { LoadingWrapper } from "../../shared/styles";

import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
} from "../../components/Form";
import Button, { ButtonIcon } from "../../components/Button";
import ArrowRightCircleIcon from "../../components/svg/ArrowRightCircle";
import CheckCircleIcon from "../../components/svg/CheckCircle";
import CheckmarkCircle from "../../components/CheckmarkCircle";
import { Formik } from "formik";
import * as Yup from "yup";

const pageSchema = Yup.object().shape({
  contentTemporary: Yup.string().trim().required("Required"),
});

function EditPage() {
  const router = useRouter();
  const { pageId } = router.query;
  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [pageFetched, setPageFetched] = useState(false);
  const [pageData, setPageData] = useState();
  const [faunaEditingError, setFaunaEditingError] = useState(false);
  const [pageEdited, setPageEdited] = useState(false);

  // const content = useRef("");
  // const handleChange = (evt) => {
  //   content.current = evt.target.value;
  // };
  // const handleBlur = () => {
  //   console.log(content.current);
  // };

  const fetchPage = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    await fetch(`/api/page/${pageId}`, requestOptions)
      .then((response) => response.json())
      .then((r) => {
        if (r.success && r.success.page) {
          const data = r.success.page.data;
          setPageData(data);
          setPageFetched(true);
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

  useEffect(() => {
    fetchPage();
  }, []);

  let title;
  if (pageFetched) {
    title = pageData.title;
  } else if (faunaFetchingError) {
    title = "Error";
  } else {
    title = "Loading...";
  }

  async function handleSubmit(values) {
    if (pageId) {
      values.published = true;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch(`/api/page/${pageId}/edit`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.error) {
            console.log("Error:", r.error);
            const errorMessage =
              r.error.name === "database_error"
                ? "An error was encountered — please try again later"
                : r.error.message;
            setFaunaEditingError(errorMessage);
          } else {
            console.log(r);
            setPageEdited(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setFaunaEditingError(error.message);
        });
    }
  }

  return (
    <>
      <Head>
        <title>{title} | pblsh</title>
      </Head>

      <PageWrapper>
        {pageFetched ? (
          <>
            <h1>{title}</h1>

            {pageEdited && (
              <Block>
                <CheckmarkWrapper>
                  <CheckmarkCircle />
                </CheckmarkWrapper>

                <h2>All Set!</h2>
                <p>Your changes have been saved successfully.</p>

                <br />

                <Button href={`/view/${pageId}`}>
                  View
                  <ButtonIcon>
                    <ArrowRightCircleIcon />
                  </ButtonIcon>
                </Button>
              </Block>
            )}

            <Formik
              initialValues={{
                contentTemporary: pageData.contentTemporary || "",
              }}
              validationSchema={pageSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ errors, touched, isSubmitting }) => (
                <FormWrapper>
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
                    <InputLabel htmlFor="contentTemporary">
                      Page Content
                    </InputLabel>
                    <Input
                      as="textarea"
                      id="contentTemporary"
                      name="contentTemporary"
                      placeholder="The quick brown fox jumped over the moon."
                      rows="10"
                      disabled={isSubmitting}
                      invalid={
                        errors.contentTemporary && touched.contentTemporary
                          ? "invalid"
                          : null
                      }
                    />
                    {errors.contentTemporary && touched.contentTemporary && (
                      <InputError animated={true}>
                        {errors.contentTemporary}
                      </InputError>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <Button type="submit" disabled={isSubmitting}>
                      Save
                      <ButtonIcon>
                        {isSubmitting ? (
                          <Loader />
                        ) : pageEdited ? (
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

            {/* <PageContent
              html={content.current}
              onBlur={handleBlur}
              onChange={handleChange}
            /> */}
          </>
        ) : faunaFetchingError ? (
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
        ) : (
          <LoadingWrapper>
            <Loader />
          </LoadingWrapper>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(EditPage));

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

const CheckmarkWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

// const editableFieldStyles = css`
//   padding: calc(0.5rem + 2px) 1.25rem 0.5rem;
//   border: var(--base-border-width) solid transparent;
//   border-left-color: var(--color-black-muted);
//   border-radius: var(--base-border-width) var(--base-border-radius)
//     var(--base-border-radius) var(--base-border-width);
//   transition: border var(--base-transition-out-duration) ease-out,
//     border-radius var(--base-transition-out-duration) ease-out,
//     background var(--base-transition-out-duration) ease-out;

//   &:hover,
//   &:focus {
//     transition: border var(--base-transition-in-duration) ease-in,
//       border-radius var(--base-transition-in-duration) ease-in,
//       background var(--base-transition-in-duration) ease-in;
//   }

//   &:hover {
//     border-left-color: var(--color-highlight);
//     background: var(--color-black-muted);
//   }

//   &:focus {
//     /* border-left-color: var(--color-highlight); */
//     border: var(--base-border-width) solid var(--color-white-muted);
//     border-radius: var(--base-border-radius);
//     background: var(--color-black-muted);
//   }
// `;

// const PageContent = styled(ContentEditable)`
//   ${editableFieldStyles};
//   margin: 1rem 0;
// `;

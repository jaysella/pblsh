import { useState, useEffect, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useFaunaFolders } from "../../hooks/useFaunaFolders";
import { useRouter } from "next/router";
import Head from "next/head";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import Tiptap from "../../components/Tiptap";
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
  InputSelect,
  InputInfo,
  InputError,
} from "../../components/Form";
import Button, { ButtonIcon } from "../../components/Button";
import ArrowRightCircleIcon from "../../components/svg/ArrowRightCircle";
import CheckCircleIcon from "../../components/svg/CheckCircle";
import CheckmarkCircle from "../../components/CheckmarkCircle";
import { Formik } from "formik";
import * as Yup from "yup";

const pageSchema = Yup.object().shape({
  publicLink: Yup.string().trim().required("Required"),
  folder: Yup.array()
    .min(1, "Pick a folder")
    .max(1, "You can only pick one folder")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
});

function EditPage() {
  const router = useRouter();
  const { pageId } = router.query;
  const [faunaFetchingError, setFaunaFetchingError] = useState(false);
  const [pageFetched, setPageFetched] = useState(false);
  const [pageData, setPageData] = useState();
  const [faunaEditingError, setFaunaEditingError] = useState(false);
  const [pageEdited, setPageEdited] = useState(false);

  const [tiptapData, setTiptapData] = useState();

  const [folderOptions, setFolderOptions] = useState([]);
  const [currentFolder, setCurrentFolder] = useState([]);

  const { faunaFoldersStatus, faunaFoldersData, faunaFoldersError } =
    useFaunaFolders();

  // Fetch page
  useEffect(() => {
    const fetchPage = async () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };

      await fetch(`/api/page/${pageId}`, requestOptions)
        .then((response) => response.json())
        .then((r) => {
          if (r.success && r.success.page) {
            const data = r.success.page.data[0];
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

    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  useEffect(() => {
    if (faunaFoldersStatus === "fetched" && pageData) {
      console.log("hooray", faunaFoldersData);

      let folders = [];

      faunaFoldersData.forEach((folder) => {
        const element = {
          value: folder.ref["@ref"].id,
          label: folder.data.name,
        };

        folders.push(element);
      });

      setFolderOptions(folders);
      setCurrentFolder(
        folders.find((folder) => {
          return folder.value === pageData.folder.ref["@ref"].id;
        })
      );
    }
  }, [faunaFoldersData, faunaFoldersStatus, pageData]);

  let title;
  if (pageFetched) {
    title = pageData.page.data.title;
  } else if (faunaFetchingError) {
    title = "Error";
  } else {
    title = "Loading...";
  }

  async function handleSubmit(values) {
    if (pageId) {
      values.published = true;
      values.contentTiptap = tiptapData;

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

  const sendTiptapData = (data) => {
    // the callback
    setTiptapData(data);
  };

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
                publicLink:
                  `${process.env.NEXT_PUBLIC_BASE_URL}/view/${pageData.page.ref["@ref"].id}` ||
                  "Unknown",
                folder: [currentFolder],
              }}
              validationSchema={pageSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({
                errors,
                touched,
                values,
                setFieldValue,
                setFieldTouched,
                isSubmitting,
              }) => (
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
                    <InputLabel htmlFor="publicLink">Public Link</InputLabel>
                    <Input id="publicLink" name="publicLink" disabled={true} />
                    <InputInfo>This cannot be changed</InputInfo>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel htmlFor="folder">Folder</InputLabel>
                    <InputSelect
                      id="folder"
                      name="folder"
                      options={folderOptions}
                      multi={false}
                      value={values.folder}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.folder}
                      touched={touched.folder}
                      disabled={isSubmitting}
                      invalid={
                        errors.folder && touched.folder ? "invalid" : null
                      }
                    />
                    {errors.folder && touched.folder && (
                      <InputError animated={true}>{errors.folder}</InputError>
                    )}
                  </InputGroup>

                  <Tiptap
                    editable={true}
                    initialJson={pageData.page.data.contentTiptap}
                    sendTiptapData={sendTiptapData}
                  />

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

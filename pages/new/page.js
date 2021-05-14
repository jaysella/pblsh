import { useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import ContentEditable from "react-contenteditable";
import { withDashboardLayout } from "../../components/layout/DashboardLayout";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
  // InputInfo,
} from "../../components/Form";
import { Formik } from "formik";
import * as Yup from "yup";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const pageSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Too long! Please limit your title to 50 characters or less")
    .trim()
    .required("Required"),
  publishDate: Yup.date().default(function () {
    return new Date();
  }),
});

const currentDate = new Date();

function NewPage() {
  const content = useRef("");

  const handleChange = (evt) => {
    text.current = evt.target.value;
  };

  const handleBlur = () => {
    console.log(content.current);
  };

  return (
    <>
      <Head>
        <title>New Page | pblsh</title>
      </Head>

      <Content>
        <h1>Craft a New Page</h1>

        <FormSection>
          <Formik
            initialValues={{
              pageTitle: "New Page",
              publishDate: `${currentDate.getFullYear()}-${
                currentDate.getMonth() < 10
                  ? "0" + currentDate.getMonth()
                  : currentDate.getMonth()
              }-${currentDate.getDate()}`,
            }}
            validationSchema={pageSchema}
            onSubmit={() => alert("onSubmit() fired")}
            // onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched, isSubmitting }) => (
              <FormWrapper>
                {/* {faunaError && (
            <ErrorBlock>
              <WarningIconWrapper>
                <AlertTriangleIcon />
              </WarningIconWrapper>

              <h2>Error Encountered</h2>
              <p>{faunaError || "An error was encountered — please try again later"}</p>
            </ErrorBlock>
          )} */}

                <InputGroup>
                  <InputLabel htmlFor="title">Page Title</InputLabel>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="New Page"
                    disabled={!isSubmitting}
                    invalid={errors.title && touched.title ? "invalid" : null}
                  />
                  {errors.title && touched.title && (
                    <InputError animated={true}>{errors.title}</InputError>
                  )}
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="publishDate">Publish Date</InputLabel>
                  <Input
                    type="date"
                    id="publishDate"
                    name="publishDate"
                    disabled={isSubmitting}
                    invalid={
                      errors.publishDate && touched.publishDate
                        ? "invalid"
                        : null
                    }
                  />
                  {errors.publishDate && touched.publishDate && (
                    <InputError animated={true}>
                      {errors.publishDate}
                    </InputError>
                  )}
                </InputGroup>
              </FormWrapper>
            )}
          </Formik>
        </FormSection>

        <PageContent
          html={content.current}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </Content>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(NewPage));

export const Content = styled.div`
  margin: 2rem 5rem;
  /* display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-areas: "recents folders" "newPage .";
  grid-gap: 2rem; */
`;

export const editableFieldStyles = css`
  padding: calc(0.5rem + 2px) 1.25rem 0.5rem;
  border: var(--base-border-width) solid transparent;
  border-left-color: var(--color-black-muted);
  border-radius: var(--base-border-width) var(--base-border-radius)
    var(--base-border-radius) var(--base-border-width);
  transition: border var(--base-transition-out-duration) ease-out,
    border-radius var(--base-transition-out-duration) ease-out,
    background var(--base-transition-out-duration) ease-out;

  &:hover,
  &:focus {
    transition: border var(--base-transition-in-duration) ease-in,
      border-radius var(--base-transition-in-duration) ease-in,
      background var(--base-transition-in-duration) ease-in;
  }

  &:hover {
    border-left-color: var(--color-highlight);
    background: var(--color-black-muted);
  }

  &:focus {
    /* border-left-color: var(--color-highlight); */
    border: var(--base-border-width) solid var(--color-white-muted);
    border-radius: var(--base-border-radius);
    background: var(--color-black-muted);
  }
`;

export const FormSection = styled.div`
  margin: 2.5rem 0;
`;

export const PageContent = styled(ContentEditable)`
  ${editableFieldStyles};
`;

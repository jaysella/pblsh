import { useState } from "react";
import { useFaunaUser } from "../hooks/useFaunaUser";
import Router from "next/router";
import {
  FormWrapper,
  InputGroup,
  InputLabel,
  Input,
  InputError,
} from "../components/Form";
import Button, { ButtonIcon } from "../components/Button";
import ArrowRightCircleIcon from "../components/svg/ArrowRightCircle";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import Loader from "../components/Loader";
import { Formik } from "formik";
import * as Yup from "yup";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const pageSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Too long! Please limit your title to 50 characters or less")
    .trim()
    .required("Required"),
});

// const currentDate = new Date();

export default function NewPage() {
  const { faunaUserData } = useFaunaUser();
  const [faunaError, setFaunaError] = useState(false);
  const [pageCreated, setPageCreated] = useState(false);

  async function handleSubmit(values) {
    if (faunaUserData.id) {
      values.userId = faunaUserData.id;

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };

      await fetch("/api/page/new", requestOptions)
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
            const newPageId = r.success.page.ref["@ref"].id;
            console.log(r);
            setPageCreated(true);

            Router.push(`/edit/${newPageId}`);
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
      <Formik
        initialValues={{
          title: "",
          // publishDate: `${currentDate.getFullYear()}-${
          //   currentDate.getMonth() < 10
          //     ? "0" + currentDate.getMonth()
          //     : currentDate.getMonth()
          // }-${currentDate.getDate()}`,
        }}
        validationSchema={pageSchema}
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
              <InputLabel htmlFor="title">Page Title</InputLabel>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="New Page"
                disabled={isSubmitting}
                invalid={errors.title && touched.title ? "invalid" : null}
                autoFocus={true}
              />
              {errors.title && touched.title && (
                <InputError animated={true}>{errors.title}</InputError>
              )}
            </InputGroup>

            <InputGroup>
              <Button type="submit" disabled={isSubmitting}>
                Create
                <ButtonIcon>
                  {isSubmitting || pageCreated ? (
                    <Loader />
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
  );
}

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

import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Head from "next/head";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
// import {
//   FormWrapper,
//   InputGroup,
//   InputLabel,
//   Input,
//   InputError,
//   // InputInfo,
// } from "../components/Form";
// import { Formik } from "formik";
// import * as Yup from "yup";
import NewPage from "../components/NewPage";
import PageIcon from "../components/svg/Page";
import FolderIcon from "../components/svg/Folder";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  padWithBackgroundStyles,
  fadeInDownAnimation,
} from "../shared/styles";

function New() {
  const [type, setType] = useState();

  return (
    <>
      <Head>
        <title>Craft New | pblsh</title>
      </Head>

      <PageWrapper>
        <h1>Craft Something New</h1>

        <TypePicker>
          <Type
            selected={type === "page" ? true : false}
            onClick={() => setType("page")}
          >
            <IconWrapper>
              <PageIcon />
            </IconWrapper>
            <Name>Page</Name>
          </Type>
          <Type
            selected={type === "folder" ? true : false}
            onClick={() => setType("folder")}
          >
            <IconWrapper>
              <FolderIcon />
            </IconWrapper>
            <Name>Folder</Name>
          </Type>
        </TypePicker>

        {type === "page" && (
          <DetailsWrapper>
            <NewPage />
          </DetailsWrapper>
        )}

        {type === "folder" && (
          <DetailsWrapper>
            <p>
              Unfortunately, folders aren't yet implemented. Try creating a new
              page instead.
            </p>
          </DetailsWrapper>
        )}
      </PageWrapper>
    </>
  );
}

export default withDashboardLayout(withPageAuthRequired(New));

const PageWrapper = styled.main`
  margin: 3rem auto;
  max-width: 475px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TypePicker = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
`;

const Type = styled.button`
  ${linkStyles};
  ${padWithBackgroundStyles};

  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
  text-align: center;
  font-family: var(--font-sans-serif);
  border-color: ${(props) =>
    props.selected ? "var(--color-highlight)" : "var(--color-black-muted)"};
  background: ${(props) =>
    props.selected ? "var(--color-black-muted)" : "none"};
  transition: border var(--base-transition-out-duration) ease-out,
    background var(--base-transition-out-duration) ease-out;

  &:hover,
  &:focus {
    transition: border var(--base-transition-in-duration) ease-in,
      background var(--base-transition-in-duration) ease-in;
  }

  &:focus {
    box-shadow: 0 5px 10px rgba(#000, 0.1), 0 0 0 4px #b5c9fc;
  }
`;

const IconWrapper = styled.div`
  color: var(--color-white-muted);

  svg {
    width: 2.25rem;
    height: auto;
  }
`;

const Name = styled.p`
  font-size: 1.4em;
  line-height: 1.2;
`;

const DetailsWrapper = styled.div`
  margin-top: 1.25rem;
  animation: ${fadeInDownAnimation} 0.2s forwards ease-in;
`;

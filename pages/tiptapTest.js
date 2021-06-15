import { useUser } from "@auth0/nextjs-auth0";
import Head from "next/head";
import Tiptap from "../components/Tiptap";
import { withDashboardLayout } from "../components/layout/DashboardLayout";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

function TiptapTest() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <PageWrapper>
        <h1>Please wait...</h1>
      </PageWrapper>
    );
  } else if (!user) {
    return (
      <PageWrapper>
        <h1>Error 401: You do not have access to the requested page.</h1>
      </PageWrapper>
    );
  } else {
    return (
      <>
        <Head>
          <title>🏗️ Tiptap Test | pblsh</title>
        </Head>

        <PageWrapper>
          <h1>🏗️ Tiptap Test</h1>

          <Block>
            <h2>Hmm</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
          </Block>

          <Tiptap
            editable={true}
            initialHtml="
              <h2>
                Hi there,
              </h2>
              <p>
                this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
              </p>
              <ul>
                <li>
                  That’s a bullet list with one …
                </li>
                <li>
                  … or two list items.
                </li>
              </ul>
              <p>
                Isn’t that great? And all of that is editable.
              </p>
              <p>
                I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
              </p>
              <blockquote>
                Wow, that’s amazing. Good work! 👏
                <br />
                — Someone
              </blockquote>
            "
          />
        </PageWrapper>
      </>
    );
  }
}

export default withDashboardLayout(TiptapTest);

export const PageWrapper = styled.main`
  margin: 3rem auto;
  max-width: 550px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

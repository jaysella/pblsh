import { useEditor, EditorContent, generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./editor/MenuBar";
import styled from "@emotion/styled";

export default function Tiptap({
  editable,
  initialHtml,
  initialJson,
  sendTiptapData,
}) {
  const extensions = [StarterKit];

  let initialContent = "";
  if (initialHtml) {
    initialContent = initialHtml;
  } else if (initialJson) {
    initialContent = generateHTML(initialJson, extensions);
  }

  const isEditable = editable == true;
  const editor = useEditor({
    editable: isEditable,
    extensions,
    content: initialContent,
    onUpdate() {
      const json = this.getJSON();
      if (sendTiptapData) {
        sendTiptapData(json);
      }
    },
  });

  return (
    <EditorWrapper>
      {isEditable == true && <MenuBar editor={editor} />}
      <Editor editor={editor} />
    </EditorWrapper>
  );
}

const EditorWrapper = styled.section`
  border: var(--base-border-width) solid var(--color-black-muted);
  border-radius: var(--base-border-radius);
  overflow: hidden;
`;

const Editor = styled(EditorContent)`
  margin: 1.5rem;
  cursor: unset;
  font-weight: var(--font-weight-light);

  & > div > p {
    margin: 1rem 0;
  }

  ul,
  ol {
    padding: 0rem 2rem 0.35rem;
  }

  li {
    padding: 0.2rem;
  }

  blockquote {
    border-left: var(--base-border-width) solid var(--color-white-muted);
    padding-left: 1rem;

    /* cite {
      display: block;
      margin-top: 1rem;
    } */
  }

  b,
  strong {
    font-weight: var(--font-weight-bold);
  }
`;

import styled from "@emotion/styled";
import {
  Bold,
  Italic,
  ListOrdered,
  ListUnordered,
  QuoteRight,
  Undo,
  Redo,
} from "../svg/Icons";
import { linkStyles, focusStyles } from "../../shared/styles";

function MenuBar({ editor }) {
  if (!editor) {
    return null;
  }

  console.log(editor.getJSON());

  return (
    <Wrapper>
      <Left>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          <Bold />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <Italic />
        </MenuButton>
        {/* <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        S-
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        &gt;&lt;
      </MenuButton> */}
        {/* <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </MenuButton> */}
        {/* <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          P
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          h3
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 }) ? "is-active" : ""
          }
        >
          h4
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 }) ? "is-active" : ""
          }
        >
          h5
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 }) ? "is-active" : ""
          }
        >
          h6
        </MenuButton> */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          <ListUnordered />
        </MenuButton>
        {/* <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          <ListOrdered />
        </MenuButton> */}
        {/* <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </MenuButton> */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          <QuoteRight />
        </MenuButton>
        {/* <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        hr
      </MenuButton> */}
        {/* <MenuButton onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </MenuButton> */}
      </Left>
      <Right>
        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo />
        </MenuButton>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  background: var(--color-black-muted);
`;

const MenuButton = styled.button`
  ${linkStyles};

  --color-outline: var(--color-primary);

  transition: background var(--base-transition-in-duration) ease-out,
    box-shadow var(--base-transition-in-duration) ease-out;

  &:hover,
  &:focus {
    &:not(:disabled) {
      background: var(--color-black);
      transition: background var(--base-transition-out-duration) ease-in,
        box-shadow var(--base-transition-out-duration) ease-in;
    }
  }

  &:focus:not(:disabled) {
    ${focusStyles};
  }

  display: flex;
  align-content: center;
  padding: 0.75rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
  color: var(--color-white-muted);

  svg {
    height: 20px;
    width: 20px;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export default MenuBar;

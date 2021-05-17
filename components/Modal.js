import { DialogOverlay, DialogContent } from "@reach/dialog";
import { fadeInDownAnimation } from "../shared/styles";
import styled from "@emotion/styled";

export default function Modal({ label, children, ...props }) {
  return (
    <Overlay {...props}>
      <Content aria-label={label}>{children}</Content>
    </Overlay>
  );
}

const Overlay = styled(DialogOverlay)`
  background: hsla(0, 0%, 0%, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
`;

const Content = styled(DialogContent)`
  margin: 10vh auto;
  padding: 2rem;
  width: 50vw;
  background: var(--color-black);
  border: var(--base-border-width) solid var(--color-white-muted);
  border-radius: var(--base-border-radius);
  outline: none;
  animation: ${fadeInDownAnimation} 0.25s forwards ease-in;
`;

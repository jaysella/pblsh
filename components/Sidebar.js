import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { linkStyles, focusStyles } from "../shared/styles";

export function Sidebar({ children }) {
  return <SidebarWrapper>{children}</SidebarWrapper>;
}

export function SidebarButton({ children, ...props }) {
  return <SidebarButtonWrapper {...props}>{children}</SidebarButtonWrapper>;
}

const sidebarPadStyles = css`
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

const SidebarWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: var(--base-border-width);
  border-radius: var(--base-border-radius) 0 0 var(--base-border-radius);
  background: var(--color-black-muted);
  /* background: transparent; */
  /* border: var(--base-border-width) solid var(--color-black-muted); */
  /* border-right: none; */
  /* transition: background var(--base-transition-in-duration) ease-out; */

  /* &:hover {
    background: var(--color-black-muted);
  } */

  button {
    ${sidebarPadStyles}
  }
`;

const SidebarButtonWrapper = styled.button`
  ${sidebarPadStyles};
`;

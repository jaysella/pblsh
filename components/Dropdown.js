import { forwardRef } from "react";
import Link from "next/link";
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuLink,
} from "@reach/menu-button";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  linkStyles,
  dropdownButtonStyles,
  fadeInDownAnimation,
} from "../shared/styles";

export default function Dropdown({ children }) {
  return <Menu>{children}</Menu>;
}

export function DropdownButton({ children }) {
  return <Button>{children}</Button>;
}

export function DropdownItems({ children }) {
  return <List>{children}</List>;
}

export function DropdownItem({ children, link, href }) {
  return (
    <>
      {link ? (
        <Link href={href} passHref>
          <CustomLink tabIndex={0}>{children}</CustomLink>
        </Link>
      ) : (
        <Item onSelect={() => alert("test")}>{children}</Item>
      )}
    </>
  );
}

const CustomLink = forwardRef(function customLink(
  { children, onClick, href },
  ref
) {
  return (
    <LinkedItem href={href} onClick={onClick} ref={ref}>
      {children}
    </LinkedItem>
  );
});

export const Button = styled(MenuButton)`
  ${dropdownButtonStyles};
  display: flex;
  border: var(--base-border-width) solid transparent;
  border-radius: var(--base-border-radius);

  &[aria-expanded="true"] {
    background: var(--color-black-muted);
    border: var(--base-border-width) solid var(--color-primary);
  }
`;

export const List = styled(MenuList)`
  margin-top: 0.5rem;
  border-radius: calc(var(--base-border-radius) / 1.5);
  background: var(--color-black-muted);
  border: var(--base-border-width) solid var(--color-primary);
  overflow: hidden;
  min-width: 150px;

  animation: ${fadeInDownAnimation} 0.2s forwards ease-in;
`;

export const menuItemStyles = css`
  ${linkStyles};

  display: block;
  padding: calc(0.85rem + 2px) 1rem 0.85rem;
  color: var(--color-white);
  box-shadow: 0 calc(var(--base-border-width) / 2) 0 var(--color-black);
  transition: background calc(var(--base-transition-in-duration) / 2) ease-out,
    box-shadow calc(var(--base-transition-in-duration) / 2) ease-out;

  span {
    margin-top: 0.35rem;
    display: block;
    font-size: 0.75em;
    font-weight: var(--font-weight-light);
  }

  &[data-selected],
  :hover {
    background: var(--color-black);
    box-shadow: none;
    transition: background calc(var(--base-transition-out-duration) / 2) ease-in,
      box-shadow calc(var(--base-transition-out-duration) / 2) ease-in;
  }
`;

export const Item = styled(MenuItem)`
  ${menuItemStyles};
`;

export const LinkedItem = styled(MenuLink)`
  ${menuItemStyles};
`;

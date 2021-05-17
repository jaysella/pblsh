import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { linkStyles, buttonHoverStyles } from "../shared/styles";

export default function Button({
  children,
  href,
  fullWidth,
  borderless,
  ...props
}) {
  return (
    <>
      {href && href.length > 0 ? (
        <Link href={href} passHref>
          <LinkWrapper
            fullWidth={fullWidth || false}
            borderless={borderless || false}
            {...props}
          >
            {children}
          </LinkWrapper>
        </Link>
      ) : (
        <ButtonWrapper
          fullWidth={fullWidth || false}
          borderless={borderless || false}
          {...props}
        >
          {children}
        </ButtonWrapper>
      )}
    </>
  );
}

export function ButtonIcon({ children }) {
  return <IconWrapper>{children}</IconWrapper>;
}

export const IconWrapper = styled.div`
  margin-bottom: 2px;
  color: var(--color-white-muted);
  transition: color var(--base-transition-in-duration) ease-out;

  svg {
    display: block;
    height: 20px;
    width: 20px;
  }
`;

export const buttonStyles = css`
  ${linkStyles};
  ${buttonHoverStyles};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem calc(0.6rem - 1px);
  background: transparent;
  border: var(--base-border-width) solid transparent;
  border-radius: calc(var(--base-border-radius) / 1.5);
  color: var(--color-white);
  font-family: var(--font-sans-serif);
  font-size: 14px;

  &:hover:not(:disabled) {
    > div {
      transition: color var(--base-transition-out-duration) ease-in;
      color: var(--color-primary);
    }
  }

  :disabled {
    cursor: not-allowed;
  }
`;

export const ButtonWrapper = styled.button`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--color-primary)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
`;

export const LinkWrapper = styled.a`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--color-primary)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
`;

import React from "react";
import Link from "next/link";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { linkStyles, buttonHoverStyles } from "../shared/styles";

export default function Button({
  children,
  href,
  color,
  fullWidth,
  size,
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
            className={`color-${color || "default"} size-${size || "default"}`}
            {...props}
          >
            {children}
          </LinkWrapper>
        </Link>
      ) : (
        <ButtonWrapper
          fullWidth={fullWidth || false}
          borderless={borderless || false}
          className={`color-${color || "default"} size-${size || "default"}`}
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
    height: var(--button-icon-size);
    width: var(--button-icon-size);
  }
`;

export const buttonStyles = css`
  ${linkStyles};
  ${buttonHoverStyles};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: var(--base-border-width) solid transparent;
  border-radius: calc(var(--base-border-radius) / 1.5);
  color: var(--color-white);
  font-family: var(--font-sans-serif);

  &.color {
    &-default {
      --button-color: var(--color-primary);
    }

    &-primary {
      --button-color: var(--color-primary);
    }

    &-secondary {
      --button-color: var(--color-secondary);
    }

    &-warning {
      --button-color: var(--color-tertiary);
    }
  }

  &.size {
    &-small {
      --button-padding: 0.5rem 0.75rem calc(0.5rem - 1px);
      --button-font-size: 12px;
      --button-icon-size: 14px;
    }

    &-default {
      --button-padding: 0.6rem 1rem calc(0.6rem - 1px);
      --button-font-size: 14px;
      --button-icon-size: 20px;
    }
  }

  padding: var(--button-padding);
  font-size: var(--button-font-size);

  &:hover:not(:disabled) {
    > div {
      transition: color var(--base-transition-out-duration) ease-in;
      color: var(--button-color);
    }
  }

  :disabled {
    cursor: not-allowed;
  }
`;

export const ButtonWrapper = styled.button`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--button-color)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
`;

export const LinkWrapper = styled.a`
  ${buttonStyles};
  border-color: ${(props) => (props.borderless ? "" : "var(--button-color)")};
  width: ${(props) => (props.fullWidth ? "100%" : "max-content")};
`;

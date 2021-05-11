import React from "react";
import styled from "@emotion/styled";
import { linkStyles, buttonHoverStyles } from "../shared/styles";

export default function Button({ children }) {
  return <ButtonWrapper>{children}</ButtonWrapper>;
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

export const ButtonWrapper = styled.button`
  ${linkStyles};
  ${buttonHoverStyles};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem calc(0.6rem - 2px);
  /* padding: calc(0.675rem - 2px) 1rem 0.675rem; */
  background: transparent;
  border: var(--base-border-width) solid var(--color-primary);
  border-radius: calc(var(--base-border-radius) / 1.5);
  color: var(--color-white);
  font-family: var(--font-sans-serif);
  font-size: 14px;
  /* transition: border var(--base-transition-out-duration) ease-out; */

  &:hover {
    > div {
      transition: color var(--base-transition-out-duration) ease-in;
      color: var(--color-primary);
    }
    /* border-color: var(--color-highlight); */
    /* transition: border var(--base-transition-in-duration) ease-in; */
  }

  /* transition: all 0.15s ease; */

  /*

  &.full {
    width: 100%;
  }

  &.focus {
    border: 2px solid transparent;

    &:active {
      border: 2px solid var(--gold);
    }
  }

  &.icon {
    > span {
      display: inline-block;
      margin-left: 0.325rem;
      will-change: transform;
      transform: translateX(0);
      transition: transform 0.375s ease;
    }

    &:hover > span,
    &:focus-visible > span {
      transform: translateX(0.45rem);
      transition: transform 0.25s ease-out;
    }
  } */
`;

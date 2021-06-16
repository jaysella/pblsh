import { css, Global, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const globalStyles = (
  <Global
    styles={css`
      :root {
        --color-black: #031822;
        --color-white: #f5f0f6;
        --color-primary: #85ffc7;
        --color-secondary: #39a9db;
        --color-tertiary: #ff8552;
        --color-tertiary-opacity: rgba(255, 133, 82, 0.5);
        --color-highlight: #ffdf64;

        --color-black-muted: #20323b;
        --color-white-muted: #90a2ab;

        --base-border-radius: 12px;

        --base-border-width: 2px;

        --font-sans-serif: "Farro", -apple-system, BlinkMacSystemFont, Segoe UI,
          Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
          Helvetica Neue, sans-serif;

        --font-weight-light: 300;
        --font-weight-medium: 500;
        --font-weight-bold: 700;

        --base-transition-in-duration: 0.1s;
        --base-transition-out-duration: 0.175s;

        --loader-size: 1.25rem;

        /* --font-monospace: "Roboto Mono", "SFMono-Regular", Consolas,
          "Roboto Mono", "Droid Sans Mono", "Liberation Mono", Menlo, Courier,
          monospace;
        --font-cursive: "Sriracha", var(--sans-serif); */
      }

      html {
        text-size-adjust: 100%;
        box-sizing: border-box;
        overflow-y: auto;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        background-color: var(--color-black);
        color: var(--color-white);
        font-family: var(--font-sans-serif);
        font-weight: var(--font-weight-bold);
        overflow-wrap: break-word;
        font-kerning: normal;
        font-feature-settings: "kern", "liga", "clig", "calt";
      }

      * {
        box-sizing: inherit;
        margin: 0;
        padding: 0;
        outline: none;
      }

      img,
      svg {
        user-drag: none;
        user-select: none;
      }

      a {
        text-decoration: none;
      }

      button {
        all: initial;
        cursor: pointer;
        font-size: inherit;
        font-family: var(--font-sans-serif);
        font-weight: var(--font-weight-bold);
      }

      input {
        font-family: var(--font-sans-serif);
        font-size: 100%;
        line-height: 1.15;
      }

      :disabled {
        cursor: not-allowed;
      }

      p {
        padding-top: 2px;
        line-height: 1.3;
      }
    `}
  />
);

export const linkStyles = css`
  &:not(:disabled) {
    cursor: pointer;
  }
`;

export const focusStyles = css`
  box-shadow: 0 0 0 var(--base-border-width) var(--color-outline);
`;

export const hoverStyles = css`
  transition: background var(--base-transition-in-duration) ease-out,
    box-shadow var(--base-transition-in-duration) ease-out;

  &:hover,
  &:focus {
    &:not(:disabled) {
      background: var(--color-black-muted);
      transition: background var(--base-transition-out-duration) ease-in,
        box-shadow var(--base-transition-out-duration) ease-in;
    }
  }

  &:focus:not(:disabled) {
    ${focusStyles};
  }
`;

export const buttonHoverStyles = css`
  ${hoverStyles};
  --color-outline: var(--color-highlight);
`;

export const padStyles = css`
  border: var(--base-border-width) solid transparent;
  color: var(--color-white);
  transition: all var(--base-transition-out-duration) ease-out;

  &:hover,
  &:focus {
    border-color: var(--color-primary);
    transition: all var(--base-transition-in-duration) ease-in;
  }
`;

export const padWithBackgroundStyles = css`
  ${padStyles};
  background: var(--color-black-muted);
`;

export const dropdownButtonStyles = css`
  ${buttonHoverStyles};
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInDownAnimation = keyframes`
  from {
    transform: translateY(-.25rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const blink = keyframes`
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
  
  100% {
    opacity: 1;
  }
`;

export const strokeAnimation = keyframes`
  100% {
    stroke-dashoffset: 0;
  }
}`;

export const scaleAnimation = keyframes`
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}`;

export const fillAnimation = keyframes`
  100% {
    box-shadow: inset 0px 0px 0px 30px var(--color-primary);
  }
}`;

export const sectionTitle = css`
  font-size: 0.8em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  color: var(--color-white-muted);
`;

export const LoadingWrapper = styled.div`
  --loader-size: 2.5rem;
  margin: 5rem 0;
  display: flex;
  justify-content: space-around;
  animation: ${fadeInAnimation} 0.5s forwards ease-in;
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

export const ErrorBlock = styled.section`
  ${contentBlock};
  border-color: var(--color-tertiary);
`;

export const WarningIconWrapper = styled.div`
  margin-bottom: 1.25rem;
  color: var(--color-tertiary);

  svg {
    width: 2.5rem;
    height: auto;
  }
`;

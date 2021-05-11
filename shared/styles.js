import { css, Global, keyframes } from "@emotion/react";

export const globalStyles = (
  <Global
    styles={css`
      :root {
        --color-black: #031822;
        --color-white: #f5f0f6;
        --color-primary: #85ffc7;
        --color-secondary: #39a9db;
        --color-tertiary: #ff8552;
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
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }

      a {
        text-decoration: none;
      }

      button {
        all: initial;
        cursor: pointer;
      }

      input {
        font-family: var(--font-sans-serif);
        font-size: 100%;
        line-height: 1.15;
      }
    `}
  />
);

export const linkStyles = css`
  cursor: pointer;
`;

export const focusStyles = css`
  box-shadow: 0 0 0 var(--base-border-width) var(--color-outline);
`;

export const hoverStyles = css`
  transition: background var(--base-transition-in-duration) ease-out,
    box-shadow var(--base-transition-in-duration) ease-out;

  &:hover,
  &:focus {
    background: var(--color-black-muted);
    transition: background var(--base-transition-out-duration) ease-in,
      box-shadow var(--base-transition-out-duration) ease-in;
  }

  &:focus {
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
  transition: border var(--base-transition-out-duration) ease-out;

  &:hover,
  &:focus {
    border-color: var(--color-primary);
    transition: border var(--base-transition-in-duration) ease-in;
  }
`;

export const padWithBackgroundStyles = css`
  ${padStyles};
  background: var(--color-black-muted);
`;

export const dropdownButtonStyles = css`
  ${buttonHoverStyles};
`;

export const fadeInDown = keyframes`
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

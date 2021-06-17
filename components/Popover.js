import * as RadixPopover from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { fadeInLeftAnimation, fadeInRightAnimation } from "../shared/styles";

export default function Popover({ children, ...props }) {
  return <RadixPopover.Root {...props}>{children}</RadixPopover.Root>;
}

export function PopoverTrigger({ children, ...props }) {
  return <RadixPopover.Trigger {...props}>{children}</RadixPopover.Trigger>;
}

export function PopoverContent({ theme, includeArrow, children, ...props }) {
  return (
    <Content className={theme ? `theme-${theme}` : "theme-info"} {...props}>
      {children}
      {includeArrow && <Arrow />}
    </Content>
  );
}

export function PopoverActions({ children }) {
  return <ActionsWrapper>{children}</ActionsWrapper>;
}

export function PopoverClose({ children, ...props }) {
  return <RadixPopover.Close {...props}>{children}</RadixPopover.Close>;
}

const Content = styled(RadixPopover.Content)`
  &.theme {
    &-info {
      --popover-color: var(--color-white-muted);
    }

    &-primary {
      --popover-color: var(--color-primary);
    }

    &-secondary {
      --popover-color: var(--color-secondary);
    }

    &-warning {
      --popover-color: var(--color-tertiary);
    }
  }

  padding: 1.5rem;
  background: var(--color-black-muted);
  border-radius: var(--base-border-radius);
  border: var(--base-border-width) solid var(--popover-color);
  width: max-content;
  max-width: 400px;
  overflow: hidden;

  &[data-side="left"] {
    animation: ${fadeInRightAnimation} 0.35s forwards ease-out;
  }

  &[data-side="right"] {
    animation: ${fadeInLeftAnimation} 0.35s forwards ease-out;
  }

  h2 {
    margin-bottom: 0.5rem;
    line-height: 1.35;
  }

  p {
    font-weight: var(--font-weight-light);
    font-size: 0.9em;
    line-height: 1.5;

    &:not(:last-of-type) {
      margin-bottom: 0.25rem;
    }

    a {
      color: var(--color-primary);
      font-weight: var(--font-weight-bold);

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ActionsWrapper = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Arrow = styled(RadixPopover.Arrow)`
  fill: var(--popover-color);
`;

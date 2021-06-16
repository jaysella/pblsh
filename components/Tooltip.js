import { forwardRef } from "react";
import Tippy from "@tippyjs/react";
import styled from "@emotion/styled";
import "tippy.js/animations/scale-subtle.css";

export default function Tooltip({ content, children, ...props }) {
  return (
    <Tippy
      content={content}
      placement="bottom"
      theme="pblsh"
      arrow={false}
      animation="scale-subtle"
      inertia={true}
      // DEBUG:
      // hideOnClick={false}
      // trigger="click"
      {...props}
    >
      <CustomContent>{children}</CustomContent>
    </Tippy>
  );
}

export function TooltipIcon({ children }) {
  return <IconWrapper>{children}</IconWrapper>;
}

const CustomContent = forwardRef(function customContent({ children }, ref) {
  return <div ref={ref}>{children}</div>;
});

const IconWrapper = styled.span`
  margin-left: 0.3rem;

  svg {
    width: 13px;
    height: 13px;
  }
`;

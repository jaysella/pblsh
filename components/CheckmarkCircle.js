import styled from "@emotion/styled";
import {
  strokeAnimation,
  scaleAnimation,
  fillAnimation,
} from "../shared/styles";

export default function CheckmarkCircle() {
  return (
    <Checkmark xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <Circle cx="26" cy="26" r="25" fill="none" />
      <Path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </Checkmark>
  );
}

export const Checkmark = styled.svg`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: block;
  stroke-width: var(--base-border-width);
  stroke: var(--color-black-muted);
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px var(--color-primary);
  animation: ${fillAnimation} 0.4s ease-in-out 0.4s forwards,
    ${scaleAnimation} 0.3s ease-in-out 0.9s both;
`;

export const Circle = styled.circle`
  stroke-dasharray: 150;
  stroke-dashoffset: 150;
  stroke-width: var(--base-border-width);
  stroke-miterlimit: 10;
  stroke: var(--color-primary);
  animation: ${strokeAnimation} 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
`;

export const Path = styled.path`
  transform-origin: 50% 50%;
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: ${strokeAnimation} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s
    forwards;
`;

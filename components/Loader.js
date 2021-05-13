import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export default function Loader() {
  return (
    <Spinner>
      <Bounce1 />
      <Bounce2 />
    </Spinner>
  );
}

const Spinner = styled.div`
  --loader-size: 1.25rem;
  position: relative;
  width: var(--loader-size);
  height: var(--loader-size);
`;

const bounceAnimation = keyframes`
  0%, 100% { 
    transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
  }
`;

const bounceStyles = css`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--color-white-muted);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: ${bounceAnimation} 2s infinite ease-in-out;
`;

const Bounce1 = styled.div`
  ${bounceStyles};
`;

const Bounce2 = styled.div`
  ${bounceStyles};
  animation-delay: -1s;
`;

import { useState, useCallback, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import useHasMounted from "../hooks/useHasMounted";
import useHotkey from "../hooks/useHotkey";
import { focusStyles } from "../shared/styles";

export default function SearchBar() {
  const hasMounted = useHasMounted();
  const [focusInputs, setFocusInputs] = useState(0);
  const keys = ["/"];

  const handleHotKey = useCallback(() => {
    setFocusInputs(focusInputs + 1);
  }, [focusInputs]);

  useHotkey(keys, handleHotKey);

  const inputRef = useRef(null);

  useEffect(() => {
    if (hasMounted) {
      if (focusInputs > 0) {
        inputRef.current.focus();
      }
    }

    return () => {
      return null;
    };
  }, [focusInputs]);

  return (
    <Wrapper>
      {/* <label aria-hidden="true">Search</label> */}
      <Input type="text" placeholder="Search (/)" ref={inputRef} />
    </Wrapper>
  );
}

export const Wrapper = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
  max-width: 400px;
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  border-radius: var(--base-border-radius);
  font-family: var(--font-sans-serif);
  font-size: 15px;
  font-weight: var(--font-weight-light);
  padding: 2px 20px 0 40px;
  background-image: url("data:image/svg+xml,%0A%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z' stroke='%2390a2ab' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/%3E%3Cpath d='M19 19L14.65 14.65' stroke='%2390a2ab' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E%0A");
  background-size: 14px;
  background-repeat: no-repeat;
  background-position: 16px 48%;
  color: var(--color-white);
  transition: box-shadow var(--base-transition-out-duration) ease-out,
    background var(--base-transition-out-duration) ease-out;

  ::placeholder {
    color: var(--color-white-muted);
  }

  &:hover,
  &:focus {
    background-color: var(--color-black-muted);
  }

  /* &:hover {
    box-shadow: 0 0 0 var(--base-border-width) var(--color-primary);
  } */

  &:focus {
    --color-outline: var(--color-highlight);
    ${focusStyles};
    transition: box-shadow var(--base-transition-in-duration) ease-in,
      background var(--base-transition-in-duration) ease-in;
  }
`;

import styled from "@emotion/styled";
import { focusStyles } from "../shared/styles";

export default function Form({ children }) {
  return <FormWrapper>{children}</FormWrapper>;
}

export function InputGroup({ children }) {
  return <InputGroupWrapper>{children}</InputGroupWrapper>;
}

export function InputLabel({ children, ...props }) {
  return <InputLabelWrapper {...props}>{children}</InputLabelWrapper>;
}

export function Input({ children, ...props }) {
  return <InputWrapper {...props}>{children}</InputWrapper>;
}

export const FormWrapper = styled.form``;

export const InputGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabelWrapper = styled.label`
  font-size: 0.8em;
  text-transform: uppercase;
  color: var(--color-white-muted);
`;

export const InputWrapper = styled.input`
  border: none;
  background: var(--color-black-muted);
  border-radius: calc(var(--base-border-radius) / 1.75);
  font-family: var(--font-sans-serif);
  font-size: 15px;
  font-weight: var(--font-weight-light);
  padding: 0.85rem 1rem;
  color: var(--color-white);
  transition: box-shadow var(--base-transition-out-duration) ease-out,
    background var(--base-transition-out-duration) ease-out;

  ::placeholder {
    color: var(--color-white-muted);
  }

  &:focus {
    --color-outline: var(--color-highlight);
    ${focusStyles};
    transition: box-shadow var(--base-transition-in-duration) ease-in,
      background var(--base-transition-in-duration) ease-in;
  }
`;

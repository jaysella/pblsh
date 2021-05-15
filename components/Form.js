import styled from "@emotion/styled";
import { Form, Field } from "formik";
import Select from "react-select";
import AlertCircleIcon from "../components/svg/AlertCircle";
import AlertTriangleIcon from "../components/svg/AlertTriangle";
import { css } from "@emotion/react";
import {
  fadeInAnimation,
  fadeInDownAnimation,
  focusStyles,
} from "../shared/styles";

const customSelectStyles = {
  control: (styles, { isDisabled, isFocused }) => ({
    ...styles,
    backgroundColor: "var(--color-black-muted)",
    color: "var(--color-white)",
    border: "var(--base-border-width) solid transparent",
    borderColor: isFocused ? "var(--color-primary)" : "",
    borderRadius: "calc(var(--base-border-radius) / 1.75)",
    padding: "calc(0.25rem + 2px) .25rem 0.25rem",
    cursor: isDisabled ? "not-allowed" : "pointer",

    "&:focus": {
      borderColor: "var(--color-primary)",
      outline: "none",
    },
  }),
  menuList: (base) => ({
    ...base,
    padding: "0",
    backgroundColor: "var(--color-black-muted)",
    borderRadius: "calc(var(--base-border-radius) / 1.75)",
    border: "var(--base-border-width) solid var(--color-primary)",
    outline: "none",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      padding: "calc(0.75rem + 2px) 1rem 0.75rem",
      backgroundColor: isSelected
        ? "var(--color-secondary)"
        : "var(--color-black-muted)",
      color: "var(--color-white)",
      cursor: isDisabled ? "not-allowed" : "pointer",
      outline: "none",

      "&:hover, &:focus": {
        backgroundColor: "var(--color-black)",
      },
    };
  },
  singleValue: (provided, state) => {
    const color = "var(--color-white)";

    return { ...provided, color };
  },
};

export function FormWrapper({ children, hidden }) {
  return <FormElement hidden={hidden || false}>{children}</FormElement>;
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

export function InputSelect({ children, name, ...props }) {
  const handleChange = (value) => {
    // Call setFieldValue and manually update values[name]
    props.onChange(name, [value]);
  };

  const handleBlur = () => {
    // Call setFieldTouched
    props.onBlur(name, true);
  };

  return (
    <Select
      {...props}
      value={props.value}
      onChange={handleChange}
      onBlur={handleBlur}
      styles={customSelectStyles}
    />
  );
}

export function InputError({ children, ...props }) {
  return (
    <ErrorWrapper {...props}>
      <AlertTriangleIcon />
      <span>{children}</span>
    </ErrorWrapper>
  );
}

export function InputInfo({ children, ...props }) {
  return (
    <InfoWrapper {...props}>
      <AlertCircleIcon />
      <span>{children}</span>
    </InfoWrapper>
  );
}

export const FormElement = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  display: ${(props) => (props.hidden ? "none" : "flex")};
`;

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

export const InputWrapper = styled(Field)`
  border: none;
  background-color: var(--color-black-muted);
  border-radius: calc(var(--base-border-radius) / 1.75);
  font-family: var(--font-sans-serif);
  font-size: 15px;
  font-weight: var(--font-weight-light);
  padding: calc(0.85rem + 2px) 1rem 0.85rem;
  color: var(--color-white);
  transition: box-shadow var(--base-transition-out-duration) ease-out,
    background-color var(--base-transition-out-duration) ease-out;

  box-shadow: ${(props) =>
    props.invalid && "0 0 0 var(--base-border-width) var(--color-tertiary)"};

  i {
    color: currentColor;
  }

  ::placeholder {
    color: var(--color-white-muted);
  }

  &:focus {
    --color-outline: var(--color-secondary);
    ${focusStyles};
    transition: box-shadow var(--base-transition-in-duration) ease-in,
      background-color var(--base-transition-in-duration) ease-in;
  }

  :disabled {
    position: relative;
    padding-right: 40px;
    background-image: url("data:image/svg+xml,%0A%3Csvg width='20' height='22' viewBox='0 0 20 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M17 10H3C1.89543 10 1 10.8954 1 12V19C1 20.1046 1.89543 21 3 21H17C18.1046 21 19 20.1046 19 19V12C19 10.8954 18.1046 10 17 10Z' stroke='%2390a2ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M5 10V6C5 4.67392 5.52678 3.40215 6.46447 2.46447C7.40215 1.52678 8.67392 1 10 1C11.3261 1 12.5979 1.52678 13.5355 2.46447C14.4732 3.40215 15 4.67392 15 6V10' stroke='%2390a2ab' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: right 18px top 48%;
  }

  &[type="date"] {
    padding: 0.75rem 1rem;

    ::-webkit-calendar-picker-indicator {
      cursor: pointer;
      border-radius: var(--base-border-radius);
      opacity: 0.5;
      filter: invert(1);
      transition: opacity var(--base-transition-out-duration) ease-out;

      &:hover {
        opacity: 1;
        transition: opacity var(--base-transition-in-duration) ease-in;
      }
    }
  }
`;

export const feedbackStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
  margin: 0.25rem 0 0.5rem;
  font-size: 0.8em;
  font-weight: var(--font-weight-light);

  span {
    margin-top: 2px;
  }
`;

const feedbackAnimation = css`
  animation: ${fadeInDownAnimation} 0.25s forwards ease-in;
`;

export const ErrorWrapper = styled.div`
  ${feedbackStyles};
  color: var(--color-tertiary);
  ${(props) => props.animated && feedbackAnimation};
`;

export const InfoWrapper = styled.div`
  ${feedbackStyles};
  color: var(--color-secondary);
  ${(props) => props.animated && feedbackAnimation};
`;

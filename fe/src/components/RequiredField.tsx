import React from "react";
import styles from "./RequiredField.module.scss";

interface RequiredFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  required?: boolean;
}

const Label: React.FC<RequiredFieldProps> = ({
  label,
  htmlFor,
  className,
  required = false,
}) => {
  return (
    <label htmlFor={htmlFor} className={className || styles.label}>
      {label}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
};

export default Label;
